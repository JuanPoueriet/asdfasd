
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsPayableService } from './accounts-payable.service';
import { AccountsPayableController } from './accounts-payable.controller';
import { VendorBill } from './entities/vendor-bill.entity';
import { VendorBillLine } from './entities/vendor-bill-line.entity';
import { VendorPayment } from './entities/vendor-payment.entity';
import { VendorDebitNote } from './entities/vendor-debit-note.entity';
import { PaymentBatch } from './entities/payment-batch.entity';
import { OrganizationSettings } from '@univeex/organizations/feature-api';
import { JournalEntriesModule } from '@univeex/journal-entries/feature-api';
import { InventoryModule } from '@univeex/inventory/feature-api';
import { WorkflowsModule } from '@univeex/workflows/feature-api';
import { ExchangeRate } from '@univeex/currencies/feature-api';
import { CurrenciesModule } from '@univeex/currencies/feature-api';
import { BudgetsModule } from '@univeex/budgets/feature-api';
import { VendorDebitNotesController } from './vendor-debit-notes.controller';
import { VendorDebitNotesService } from './vendor-debit-notes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendorBill,
      VendorBillLine,
      VendorPayment,
      VendorDebitNote,
      PaymentBatch,
      OrganizationSettings,
      ExchangeRate,
    ]),
    JournalEntriesModule,
    InventoryModule,
    WorkflowsModule,
    CurrenciesModule,
    BudgetsModule,
  ],
  controllers: [AccountsPayableController, VendorDebitNotesController],
  providers: [AccountsPayableService, VendorDebitNotesService],
  exports: [AccountsPayableService, VendorDebitNotesService],
})
export class AccountsPayableModule {}
