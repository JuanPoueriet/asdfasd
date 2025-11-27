
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialReportingController } from './financial-reporting.controller';
import { FinancialReportingService } from './financial-reporting.service';

import { Account } from '@univeex/chart-of-accounts/feature-api';
import { JournalEntryLine } from '@univeex/journal-entries/feature-api';
import { OrganizationSettings } from '@univeex/organizations/feature-api';
import { Invoice } from '@univeex/invoices/backend/feature';
import { MonthlyAccountBalance } from '@univeex/reporting/feature-api';

@Module({
  imports: [

    TypeOrmModule.forFeature([
      Account,
      JournalEntryLine,
      OrganizationSettings,
      Invoice,
      MonthlyAccountBalance,
    ]),
  ],
  controllers: [FinancialReportingController],
  providers: [FinancialReportingService],

  exports: [FinancialReportingService],
})
export class FinancialReportingModule {}