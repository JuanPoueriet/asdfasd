
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalEntryLine } from './entities/journal-entry-line.entity';
import { Journal } from './entities/journal.entity';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { StorageModule } from '@univeex/storage/feature-api';
import { JournalEntryAttachment } from './entities/journal-entry-attachment.entity';
import { AuthModule } from '@univeex/auth/feature-api';
import { ChartOfAccountsModule } from '@univeex/chart-of-accounts/feature-api';
import { AdjustmentsService } from './adjustments.service';
import { AdjustmentsController } from './adjustments.controller';
import { AccountingModule } from '@univeex/accounting/api-feature-chart-of-accounts';
import { AccountPeriodLock } from '@univeex/accounting/api-data-access';
import { WorkflowsModule } from '@univeex/workflows/feature-api';
import { JournalEntryLineValuation } from './entities/journal-entry-line-valuation.entity';
import { DimensionsModule } from '@univeex/dimensions/feature-api';
import { BullModule } from '@nestjs/bullmq';
import { RecurringEntriesProcessor } from './recurring-entries.processor';

import { JournalEntryImportBatch } from './entities/journal-entry-import-batch.entity';
import { JournalEntryImportService } from './journal-entry-import.service';
import { FileParserService } from './parsers/file-parser.service';
import { WebsocketsModule } from '@univeex/websockets/feature-api';
import { RecurringJournalEntry } from './entities/recurring-journal-entry.entity';
import { JournalEntryTemplate } from './entities/journal-entry-template.entity';
import { RecurringJournalEntriesService } from './recurring-journal-entries.service';
import { RecurringJournalEntriesController } from './recurring-journal-entries.controller';
import { JournalEntryTemplatesService } from './journal-entry-templates.service';
import { JournalEntryTemplatesController } from './journal-entry-templates.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalEntry,
      JournalEntryLine,
      Journal,
      JournalEntryAttachment,
      AccountPeriodLock,
      JournalEntryLineValuation,
      JournalEntryImportBatch,
      RecurringJournalEntry,
      JournalEntryTemplate,
    ]),
    StorageModule,
    AuthModule,
    ChartOfAccountsModule,
    AccountingModule,
    WorkflowsModule,
    DimensionsModule,
    WebsocketsModule,
    BullModule.registerQueue({
      name: 'recurring-entries',
    }),
  ],
  controllers: [
    JournalEntriesController,
    JournalsController,
    AdjustmentsController,
    RecurringJournalEntriesController,
    JournalEntryTemplatesController,
  ],
  providers: [
    JournalEntriesService,
    JournalsService,
    AdjustmentsService,
    JournalEntryImportService,
    FileParserService,
    RecurringJournalEntriesService,
    JournalEntryTemplatesService,
    RecurringEntriesProcessor,
  ],
  exports: [JournalEntriesService, JournalsService],
})
export class JournalEntriesModule {}
