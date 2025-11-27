
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReconciliationController } from './reconciliation.controller';
import { ReconciliationService } from './reconciliation.service';
import { BankStatement } from './entities/bank-statement.entity';
import { BankTransaction } from './entities/bank-transaction.entity';
import { CsvParserService } from './parsers/csv-parser.service';
import { Account } from '@univeex/chart-of-accounts/feature-api';
import { AuthModule } from '@univeex/auth/feature-api';
import { JournalEntryLine } from '@univeex/journal-entries/feature-api';
import { ReconciliationRule } from './entities/reconciliation-rule.entity';
import { Ledger } from '@univeex/accounting/api-data-access';

import { JournalEntriesModule } from '@univeex/journal-entries/api';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankStatement,
      BankTransaction,
      Account,
      JournalEntryLine,
      ReconciliationRule,
      Ledger,
    ]),
    AuthModule,
    JournalEntriesModule,
  ],
  controllers: [ReconciliationController],
  providers: [ReconciliationService, CsvParserService],
})
export class ReconciliationModule {}