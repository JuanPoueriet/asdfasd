













































import { Module, forwardRef } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceLineItem } from './entities/invoice-line-item.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CustomersModule } from 'src/customers/customers.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { TaxesFeatureApiModule } from '@univeex/taxes/feature-api';
import { ComplianceModule } from 'src/compliance/compliance.module';
import { AccountingModule } from 'src/accounting/accounting.module';
import { AccountingPeriod } from 'src/accounting/entities/accounting-period.entity';
import { AccountPeriodLock } from 'src/accounting/entities/account-period-lock.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationSettings } from 'src/organizations/entities/organization-settings.entity';
import { ExchangeRate } from 'src/currencies/entities/exchange-rate.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceLineItem,

      AccountingPeriod,
      AccountPeriodLock,
      Organization,
      OrganizationSettings,
      ExchangeRate,
    ]),
    AuthModule,
    CustomersModule,
    InventoryModule,
    TaxesFeatureApiModule,
    ComplianceModule,
    AccountingModule,
    forwardRef(() => SharedModule),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}