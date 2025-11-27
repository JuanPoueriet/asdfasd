
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsolidationService } from './consolidation.service';
import { ConsolidationController } from './consolidation.controller';
import { Organization } from '@univeex/organizations/feature-api';
import { OrganizationSubsidiary } from '@univeex/organizations/feature-api';
import { FinancialReportingModule } from '@univeex/financial-reporting/feature-api';
import { AuthModule } from '@univeex/auth/feature-api';
import { ConsolidationMap } from './entities/consolidation-map.entity';


import { OrganizationSettings } from '@univeex/organizations/feature-api';
import { ExchangeRate } from '@univeex/currencies/feature-api';
import { ConsolidationMappingController } from './consolidation-mapping.controller';
import { ConsolidationMappingService } from './consolidation-mapping.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationSubsidiary,
      ConsolidationMap,


      OrganizationSettings,
      ExchangeRate,

    ]),
    FinancialReportingModule,
    AuthModule,
  ],

  providers: [ConsolidationService, ConsolidationMappingService],
  controllers: [ConsolidationController, ConsolidationMappingController],
})
export class ConsolidationModule {}