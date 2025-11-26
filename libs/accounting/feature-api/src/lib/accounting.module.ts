import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { Account } from '@univeex/chart-of-accounts/domain';
import { Journal } from '@univeex/journal-entries/domain';
import { Ledger } from '@univeex/accounting/domain';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Journal, Ledger])],
  controllers: [AccountingController],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule {}
