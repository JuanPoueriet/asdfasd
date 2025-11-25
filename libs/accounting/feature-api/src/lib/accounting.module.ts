
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodClosingService } from './period-closing.service';
import { AccountingController } from './accounting.controller';
import { AuthModule } from '@univeex/auth/feature-api';
import { JournalEntriesModule } from 'src/journal-entries/journal-entries.module';
import { Account } from 'src/chart-of-accounts/entities/account.entity';
import { JournalEntry } from 'src/journal-entries/entities/journal-entry.entity';
import { JournalEntryLine } from 'src/journal-entries/entities/journal-entry-line.entity';
import { OrganizationSettings } from 'src/organizations/entities/organization-settings.entity';
import { InflationAdjustmentController } from './inflation-adjustment.controller';
import { InflationAdjustmentService } from './inflation-adjustment.service';
import { Organization } from 'src/organizations/entities/organization.entity';
import { FiscalYearArchivingService } from './fiscal-year-archiving.service';
import { LedgersService } from './ledgers.service';
import { LedgersController } from './ledgers.controller';
import { YearEndCloseController } from './year-end-close.controller';
import { YearEndCloseService } from './year-end-close.service';
import { PeriodLockGuard } from './guards/period-lock.guard';
import { AuditModule } from 'src/audit/audit.module';
import { ClosingAutomationService } from './closing-automation.service';
import { FixedAssetsModule } from 'src/fixed-assets/fixed-assets.module';
import { CurrenciesModule } from 'src/currencies/currencies.module';
import { LedgerMappingService } from './ledger-mapping.service';
import { LedgerMappingController } from './ledger-mapping.controller';

import {
  AccountingPeriod,
  InflationIndex,
  FiscalYear,
  Ledger,
  AccountPeriodLock,
  LedgerMappingRule,
  LedgerMappingRuleCondition
} from '@univeex/accounting/data-access';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountingPeriod,
      Account,
      JournalEntry,
      JournalEntryLine,
      OrganizationSettings,
      InflationIndex,
      Organization,
      FiscalYear,
      Ledger,
      AccountPeriodLock,
      LedgerMappingRule,
      LedgerMappingRuleCondition,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => JournalEntriesModule),
    forwardRef(() => AuditModule),
    forwardRef(() => FixedAssetsModule),
    forwardRef(() => CurrenciesModule),
  ],
  providers: [
    PeriodClosingService,
    InflationAdjustmentService,
    FiscalYearArchivingService,
    LedgersService,
    YearEndCloseService,
    PeriodLockGuard,
    ClosingAutomationService,
    LedgerMappingService,
  ],
  controllers: [
    AccountingController,
    InflationAdjustmentController,
    LedgersController,
    YearEndCloseController,
    LedgerMappingController,
  ],
  exports: [
    PeriodLockGuard,
    LedgerMappingService,
  ],
})
export class AccountingModule {}