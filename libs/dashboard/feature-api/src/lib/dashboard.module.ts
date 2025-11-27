
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ChartOfAccountsModule } from '@univeex/chart-of-accounts/feature-api';
import { InventoryModule } from '@univeex/inventory/feature-api';
import { AuthModule } from '@univeex/auth/feature-api';
import { CacheModule } from '@nestjs/cache-manager';

import { FinancialReportingModule } from '@univeex/financial-reporting/feature-api';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@univeex/organizations/feature-api';

@Module({
  imports: [
    CacheModule.register(),
    AuthModule,
    ChartOfAccountsModule,
    InventoryModule,
    FinancialReportingModule,
    TypeOrmModule.forFeature([Organization]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}