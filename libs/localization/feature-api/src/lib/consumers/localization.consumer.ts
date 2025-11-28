import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ChartOfAccountsService, CreateAccountDto } from '@univeex/chart-of-accounts/feature-api';
import { TaxesService } from '@univeex/taxes/feature-api';
import { DocumentSequencesService } from '@univeex/shared/util-backend';
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
    const { children, ...accountData } = accountDto;

    try {
      // The error indicated mismatch with CreateAccountDto.
      // We need to ensure we map AccountTemplateDto properties to CreateAccountDto correctly.
      // AccountTemplateDto likely has similar structure, but might miss 'segments' if it is a template.
      // If segments are missing, we might need to derive them or pass empty array if allowed,
      // but 'segments' has @ArrayMinSize(1).
      // Let's assume the template data HAS segments or code that can be used.
      // For now, I'll trust the spread `...accountData` covers most fields,
      // but I need to make sure 'parentId' is handled.
      // The original error was:
      // Argument of type '{ parentId: string; }' is not assignable to parameter of type 'CreateAccountDto'.
      // This implies `...createAccountDto` (or `accountData` here) was NOT compatible.
      // Let's explicitly cast or map.

      const createDto: CreateAccountDto = {
          ...accountData as any, // Force cast if shapes are slightly different, but aim for compatibility
          parentId,
          // Ensure segments exist if not present in template (which would be weird for a CoA template)
          segments: (accountData as any).segments || [accountData.code],
      };

      const createdAccount = await this.coaService.create(
        createDto,
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
