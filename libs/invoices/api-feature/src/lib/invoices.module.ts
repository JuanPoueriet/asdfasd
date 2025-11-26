













































import { Module, forwardRef } from '@nestjs/common';
import { InvoicesApplicationService } from './invoices.application.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesDataAccessModule } from '@univeex/invoices/backend/data-access';
import { AuthModule } from '@univeex/auth/feature-api';
import { CustomersModule } from '@univeex/customers/feature-api';
import { InventoryModule } from '@univeex/inventory/feature-api';
import { TaxesModule } from '@univeex/taxes/backend/feature';
import { ComplianceModule } from '@univeex/compliance/feature-api';
import { AccountingModule } from '@univeex/accounting/feature-api';
import { SharedModule } from '@univeex/shared/util-backend';

@Module({
  imports: [
    InvoicesDataAccessModule,
    AuthModule,
    CustomersModule,
    InventoryModule,
    TaxesModule,
    ComplianceModule,
    AccountingModule,
    forwardRef(() => SharedModule),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesApplicationService],
})
export class InvoicesModule {}