
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalEntryLine } from './entities/journal-entry-line.entity';
import { RecurringJournalEntry } from './entities/recurring-journal-entry.entity';
import { JournalEntryTemplate } from './entities/journal-entry-template.entity';
import { JournalEntryAttachment } from './entities/journal-entry-attachment.entity';
import { Account } from '@univeex/chart-of-accounts/feature-api';
import { AccountingPeriod } from '@univeex/accounting/api-data-access';
import { Journal } from './entities/journal.entity';
import { JournalEntriesService } from './journal-entries.service';
import { RecurringJournalEntriesService } from './recurring-journal-entries.service';
import { JournalEntryTemplatesService } from './journal-entry-templates.service';
import { JournalEntryImportService } from './journal-entry-import.service';
import { FileParserService } from './parsers/file-parser.service';
import { JournalsService } from './journals.service';
import { JournalEntriesController } from './journal-entries.controller';
import { RecurringJournalEntriesController } from './recurring-journal-entries.controller';
import { JournalEntryTemplatesController } from './journal-entry-templates.controller';
import { JournalsController } from './journals.controller';
import { AuthModule } from '@univeex/auth/feature-api';
import { ChartOfAccountsModule } from '@univeex/chart-of-accounts/feature-api';
import { StorageModule } from '@univeex/storage/feature-api';
import { WebsocketsModule } from '@univeex/websockets/feature-api';
import { Ledger } from '@univeex/accounting/api-data-access';
import { AdjustmentsService } from './adjustments.service';
import { AdjustmentsController } from './adjustments.controller';
import { AccountingModule } from '@univeex/accounting/feature-shell';
import { AccountPeriodLock } from '@univeex/accounting/api-data-access';
import { WorkflowsModule } from '@univeex/workflows/feature-api';
import { JournalEntryLineValuation } from './entities/journal-entry-line-valuation.entity';
import { DimensionRule } from '@univeex/dimensions/feature-api';
import { BullModule } from '@nestjs/bullmq';
import { RecurringEntriesProcessor } from './recurring-entries.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalEntry,
      JournalEntryLine,
      JournalEntryLineValuation,
      RecurringJournalEntry,
      JournalEntryTemplate,
      Account,
      JournalEntryAttachment,
      AccountingPeriod,
      Journal,
      Ledger,
      AccountPeriodLock,
      DimensionRule,
    ]),

    BullModule.registerQueue({
      name: 'recurring-entries-processor',
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => ChartOfAccountsModule),
    StorageModule,
    WebsocketsModule,
    forwardRef(() => AccountingModule),
    forwardRef(() => WorkflowsModule),
  ],
  providers: [
    JournalEntriesService,
    RecurringJournalEntriesService,
    JournalEntryTemplatesService,
    JournalEntryImportService,
    FileParserService,
    JournalsService,
    AdjustmentsService,
    RecurringEntriesProcessor,
  ],
  controllers: [
    JournalEntriesController,
    RecurringJournalEntriesController,
    JournalEntryTemplatesController,
    JournalsController,
    AdjustmentsController,
  ],
  exports: [JournalEntriesService],
})
export class JournalEntriesModule {}