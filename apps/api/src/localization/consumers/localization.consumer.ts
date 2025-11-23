import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ChartOfAccountsService } from 'src/chart-of-accounts/chart-of-accounts.service';
import { TaxesService } from '@univeex/taxes/feature-api';
import { DocumentSequencesService } from 'src/shared/document-sequences/document-sequences.service';
import { AccountTemplateDto } from '../entities/coa-template.entity';

@Processor('localization')
export class LocalizationConsumer extends WorkerHost {
  private readonly logger = new Logger(LocalizationConsumer.name);

  constructor(
    private readonly coaService: ChartOfAccountsService,
    private readonly taxesService: TaxesService,
    private readonly documentSequencesService: DocumentSequencesService,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Procesando job ${job.id} del tipo ${job.name}`);

    switch (job.name) {
      case 'apply-package':
        await this.handleApplyPackage(job.data);
        break;
      default:
        this.logger.warn(`Job con nombre desconocido: ${job.name}`);
    }
  }

  private async handleApplyPackage(data: any): Promise<void> {
    const { organizationId, template } = data;
    
    if (template.coaTemplate && template.coaTemplate.length > 0) {
        this.logger.log(`Aplicando CoA de la plantilla ${template.id} a la organización ${organizationId}...`);
        for (const account of template.coaTemplate) {
            await this.createAccountFromTemplate(account, organizationId, null);
        }
    }

    if (template.taxTemplates && template.taxTemplates.length > 0) {
        this.logger.log(`Aplicando Impuestos de la plantilla ${template.id} a la organización ${organizationId}...`);
        for (const tax of template.taxTemplates) {
            await this.taxesService.create(tax, organizationId);
        }
    }

    this.logger.log(`Paquete de localización aplicado exitosamente para la organización ${organizationId}.`);
  }

  private async createAccountFromTemplate(
    accountDto: AccountTemplateDto,
    organizationId: string,
    parentId: string | null,
  ): Promise<void> {
    const { children, ...createAccountDto } = accountDto;

    try {
      const createdAccount = await this.coaService.create(
        {
          ...createAccountDto,
          parentId,
        },
        organizationId,
      );

      if (children && children.length > 0) {
        for (const child of children) {
          await this.createAccountFromTemplate(
            child,
            organizationId,
            createdAccount.id,
          );
        }
      }
    } catch (error) {
        this.logger.error(`Error al crear la cuenta "${accountDto.name}" para la organización ${organizationId}: ${error.message}`, error.stack);
    }
  }
}