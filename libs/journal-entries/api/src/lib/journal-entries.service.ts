import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry, JournalEntryLine } from '@univeex/journal-entries/domain';
import { CreateJournalEntryDto } from '@univeex/journal-entries/domain';

@Injectable()
export class JournalEntriesService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
  ) {}

  create(createJournalEntryDto: CreateJournalEntryDto, organizationId: string): Promise<JournalEntry> {
    const journalEntry = this.journalEntryRepository.create({
      ...createJournalEntryDto,
      organizationId,
    });
    return this.journalEntryRepository.save(journalEntry);
  }

  findAll(organizationId: string): Promise<JournalEntry[]> {
    return this.journalEntryRepository.find({
      where: { organizationId },
      order: { date: 'DESC' },
    });
  }

  findOne(id: string, organizationId: string): Promise<JournalEntry> {
    return this.journalEntryRepository.findOne({
      where: { id, organizationId },
    });
  }

  async createWithQueryRunner(
    queryRunner: any,
    createJournalEntryDto: CreateJournalEntryDto,
    organizationId: string,
  ): Promise<JournalEntry> {
    const { lines, ...header } = createJournalEntryDto;
    const journalEntry = queryRunner.manager.create(JournalEntry, {
      ...header,
      organizationId,
    });
    const savedEntry = await queryRunner.manager.save(journalEntry);
    const lineEntities = lines.map(line => queryRunner.manager.create(JournalEntryLine, {
      ...line,
      journalEntryId: savedEntry.id
    }));
    savedEntry.lines = await queryRunner.manager.save(lineEntities);
    return savedEntry;
  }
}
