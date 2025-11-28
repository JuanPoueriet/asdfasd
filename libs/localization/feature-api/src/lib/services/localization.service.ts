
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FiscalRegion } from '../entities/fiscal-region.entity';
import { LocalizationTemplate } from '../entities/localization-template.entity';
import { Organization } from '@univeex/organizations/feature-api';
import { ChartOfAccountsService } from '@univeex/chart-of-accounts/feature-api';
import { TaxesService } from '@univeex/taxes/backend/feature';
import { panamaCoaTemplate } from '../templates/pa-coa.template';
import { panamaTaxTemplate } from '../templates/pa-taxes.template';
import { AccountTemplateDto } from '../entities/coa-template.entity';

@Injectable()
export class LocalizationService {
  private readonly logger = new Logger(LocalizationService.name);

  constructor(
    @InjectRepository(FiscalRegion)
    private readonly fiscalRegionRepository: Repository<FiscalRegion>,
    @InjectRepository(LocalizationTemplate)
    private readonly templateRepository: Repository<LocalizationTemplate>,
    @InjectQueue('localization') private localizationQueue: Queue,
    private readonly coaService: ChartOfAccountsService,
    private readonly taxesService: TaxesService,
  ) {}

  async onModuleInit() {
    await this.seedFiscalRegions();
    await this.seedTemplates();
  }

  private async seedFiscalRegions() {
    const count = await this.fiscalRegionRepository.count();
    if (count === 0) {
      this.logger.log('Seeding fiscal regions...');
      await this.fiscalRegionRepository.save([
        { code: 'PA', name: 'Panamá', currencyCode: 'USD', dateFormat: 'dd/MM/yyyy' },
        { code: 'US', name: 'Estados Unidos', currencyCode: 'USD', dateFormat: 'MM/dd/yyyy' },
        { code: 'CO', name: 'Colombia', currencyCode: 'COP', dateFormat: 'dd/MM/yyyy' },
      ]);
    }
  }

  private async seedTemplates() {
      // Logic to seed templates if needed
  }

  async applyFiscalPackage(organization: Organization): Promise<void> {
    const region = await this.fiscalRegionRepository.findOneBy({ id: organization.fiscalRegionId });
    if (!region) {
      this.logger.warn(`Región fiscal no encontrada para la organización ${organization.id}. Omitiendo localización.`);
      return;
    }

    const template = await this.templateRepository.findOne({
      where: { fiscalRegionId: region.id, isDefault: true },
      relations: ['coaTemplate', 'taxTemplates'],
    });

    if (template) {
      await this.localizationQueue.add('apply-package', {
        organizationId: organization.id,
        template,
      });
      this.logger.log(`Encolado paquete de localización ${template.name} para org ${organization.id}`);
    } else {
        // Fallback hardcoded for demo/MVP if DB template missing
        if (region.code === 'PA') {
             await this.applyHardcodedTemplate(organization.id, panamaCoaTemplate, panamaTaxTemplate);
        }
    }
  }

  private async applyHardcodedTemplate(organizationId: string, coa: AccountTemplateDto[], taxes: any[]) {
      this.logger.log(`Applying hardcoded template for ${organizationId}`);
      for(const acc of coa) {
          await this.createAccountRecursive(acc, organizationId, null);
      }
      for(const tax of taxes) {
          await this.taxesService.create(tax, organizationId);
      }
  }

  private async createAccountRecursive(accountDto: AccountTemplateDto, organizationId: string, parentId: string | null) {
    const { children, ...createAccountDto } = accountDto;

    const createdAccount = await this.coaService.create(
      {
        ...createAccountDto as any,
        parentId,
        segments: (createAccountDto as any).segments || [createAccountDto.code]
      },
      organizationId,
    );

    if (children) {
      for (const child of children) {
        await this.createAccountRecursive(child, organizationId, createdAccount.id);
      }
    }
  }
}
