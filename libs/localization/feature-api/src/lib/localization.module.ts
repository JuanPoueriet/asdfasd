
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalizationService } from './services/localization.service';
import { LocalizationConsumer } from './consumers/localization.consumer';
import { FiscalRegion } from './entities/fiscal-region.entity';
import { TaxScheme } from './entities/tax-scheme.entity';
import { ChartOfAccountsModule } from '@univeex/chart-of-accounts/feature-api';
import { TaxesModule } from '@univeex/taxes/backend/feature';
import { LocalizationTemplate } from './entities/localization-template.entity';
import { CoaTemplate } from './entities/coa-template.entity';
import { TaxTemplate } from './entities/tax-template.entity';
import { SharedUtilBackendModule } from '@univeex/shared/util-backend'; // For DocumentSequencesService

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FiscalRegion,
      TaxScheme,
      LocalizationTemplate,
      CoaTemplate,
      TaxTemplate,
    ]),
    ChartOfAccountsModule,
    TaxesModule,
    SharedUtilBackendModule,
  ],
  providers: [LocalizationService, LocalizationConsumer],
  exports: [LocalizationService],
})
export class LocalizationModule {}
