
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { Budget } from './entities/budget.entity';
import { BudgetLine } from './entities/budget-line.entity';
import { JournalEntriesModule } from '@univeex/journal-entries/feature-api';
import { BudgetControlService } from './budget-control.service';
import { JournalEntryLine } from '@univeex/journal-entries/feature-api';
import { AuthModule } from '@univeex/auth/feature-api';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Budget, 
      BudgetLine, 
      JournalEntryLine
    ]),
    JournalEntriesModule,
    AuthModule,
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetControlService],
  exports: [BudgetControlService],
})
export class BudgetsModule {}
