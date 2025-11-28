
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '@univeex/chart-of-accounts/feature-api';
import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import {
  ImportJournalEntryBatchStatus,
  JournalEntryImportBatch,
} from './entities/journal-entry-import-batch.entity';
import {
  PreviewImportResponseDto,
  ImportedEntryDto,
} from './dto/journal-entry-import.dto';
import { FileParserService } from './parsers/file-parser.service';
import { EventsGateway } from '@univeex/websockets/feature-api';
import { Journal } from './entities/journal.entity';
import { Ledger } from '@univeex/accounting/api-data-access';

@Injectable()
export class JournalEntryImportService {
  private readonly logger = new Logger(JournalEntryImportService.name);

  constructor(
    @InjectRepository(JournalEntryImportBatch)
    private batchRepository: Repository<JournalEntryImportBatch>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Journal)
    private journalRepository: Repository<Journal>,
    private journalEntriesService: JournalEntriesService,
    private fileParserService: FileParserService,
    private dataSource: DataSource,
    private eventsGateway: EventsGateway,
  ) {}

  async previewImport(
    file: Express.Multer.File,
    organizationId: string,
  ): Promise<PreviewImportResponseDto> {
    const rawData = await this.fileParserService.parse(file);
    const accounts = await this.accountRepository.find({
      where: { organizationId },
      select: ['id', 'code', 'name'],
    });
    const journals = await this.journalRepository.find({
        where: { organizationId },
        select: ['id', 'code', 'name'],
    });

    const accountMap = new Map(accounts.map((a) => [a.code, a]));
    const journalMap = new Map(journals.map((j) => [j.code, j]));

    const validEntries: ImportedEntryDto[] = [];
    const errors: string[] = [];

    // Agrupar líneas por un identificador de asiento (ej: ExternalRef)
    const groupedLines = this.groupBy(rawData, 'ExternalRef');

    for (const [ref, lines] of Object.entries(groupedLines)) {
      const firstLine = lines[0];
      const journalCode = firstLine['JournalCode'];
      const journal = journalMap.get(journalCode);

      if (!journal) {
          errors.push(`Referencia ${ref}: Diario con código '${journalCode}' no encontrado.`);
          continue;
      }

      const entryDto: ImportedEntryDto = {
        externalRef: ref,
        date: firstLine['Date'],
        description: firstLine['Description'] || `Importación ref: ${ref}`,
        journalId: journal.id,
        lines: [],
        isValid: true,
        errors: [],
      };

      let totalDebit = 0;
      let totalCredit = 0;

      for (const line of lines) {
        const accountCode = line['AccountCode'];
        const account = accountMap.get(accountCode);

        if (!account) {
          entryDto.isValid = false;
          entryDto.errors.push(`Cuenta '${accountCode}' no encontrada.`);
        }

        const debit = parseFloat(line['Debit'] || '0');
        const credit = parseFloat(line['Credit'] || '0');

        totalDebit += debit;
        totalCredit += credit;

        entryDto.lines.push({
          accountId: account?.id || '',
          accountCode: accountCode,
          debit,
          credit,
          description: line['LineDescription'] || entryDto.description,
        });
      }

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        entryDto.isValid = false;
        entryDto.errors.push(
          `Asiento desbalanceado. Débito: ${totalDebit}, Crédito: ${totalCredit}`,
        );
      }

      if (!entryDto.isValid) {
        errors.push(...entryDto.errors.map((e) => `Ref ${ref}: ${e}`));
      } else {
        validEntries.push(entryDto);
      }
    }

    // Crear un lote temporal
    const batch = this.batchRepository.create({
      organizationId,
      fileName: file.originalname,
      status: ImportJournalEntryBatchStatus.PENDING_CONFIRMATION,
      totalEntries: validEntries.length,
      previewData: validEntries,
    });
    const savedBatch = await this.batchRepository.save(batch);

    return {
      batchId: savedBatch.id,
      totalParsed: Object.keys(groupedLines).length,
      validCount: validEntries.length,
      errors,
      preview: validEntries.slice(0, 5), // Retornar solo una muestra
    };
  }

  async confirmImport(
    batchId: string,
    organizationId: string,
    userId: string
  ): Promise<void> {
    const batch = await this.batchRepository.findOneBy({
      id: batchId,
      organizationId,
    });

    if (!batch) throw new BadRequestException('Lote de importación no encontrado.');
    if (batch.status !== ImportJournalEntryBatchStatus.PENDING_CONFIRMATION) {
      throw new BadRequestException('El lote no está en estado pendiente de confirmación.');
    }

    batch.status = ImportJournalEntryBatchStatus.PROCESSING;
    await this.batchRepository.save(batch);

    // Procesar asíncronamente (simulado)
    this.processImportBatch(batch, userId).catch((err) => {
      this.logger.error(`Error procesando lote ${batchId}`, err);
      batch.status = ImportJournalEntryBatchStatus.FAILED;
      this.batchRepository.save(batch);
    });
  }

  private async processImportBatch(batch: JournalEntryImportBatch, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let importedCount = 0;
      const entries: ImportedEntryDto[] = batch.previewData;

      for (const entryData of entries) {
        const createDto: CreateJournalEntryDto = {
          date: new Date(entryData.date).toISOString(),
          description: entryData.description,
          journalId: entryData.journalId,
          lines: entryData.lines.map((l) => ({
            accountId: l.accountId,
            debit: l.debit,
            credit: l.credit,
            description: l.description,
          })),
        };

        // Usamos el servicio existente, pero necesitamos pasar el queryRunner para que sea atómico
        // Ojo: JournalEntriesService.create usa su propia transacción.
        // Para hacerlo en una sola transacción grande, necesitaríamos un método createWithQueryRunner en el servicio.
        // Por simplicidad, llamaremos a create uno por uno, si falla uno, el lote queda parcialmente importado o fallido.
        // Mejor opción: Implementar createWithQueryRunner en JournalEntriesService (Hecho en el plan anterior)

        await this.journalEntriesService.createWithQueryRunner(
          queryRunner,
          createDto,
          batch.organizationId,
        );
        importedCount++;
      }

      await queryRunner.commitTransaction();

      batch.status = ImportJournalEntryBatchStatus.COMPLETED;
      batch.importedEntries = importedCount;
      await this.batchRepository.save(batch);

      this.eventsGateway.emitToUser(userId, 'import.completed', {
          batchId: batch.id,
          count: importedCount
      });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error importando lote ${batch.id}`, error);
      batch.status = ImportJournalEntryBatchStatus.FAILED;
      batch.errorMessage = error.message;
      await this.batchRepository.save(batch);

      this.eventsGateway.emitToUser(userId, 'import.failed', {
          batchId: batch.id,
          error: error.message
      });
    } finally {
      await queryRunner.release();
    }
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue,
      );
      return result;
    }, {});
  }
}
