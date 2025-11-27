
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { AuthModule } from '@univeex/auth/feature-api';
import { CustomerPayment } from './entities/customer-payment.entity';
import { CustomerPaymentLine } from './entities/customer-payment-line.entity';
import { CustomerPaymentsController } from './customer-payments.controller';
import { CustomerPaymentsService } from './customer-payments.service';
import { InvoicesModule } from '@univeex/invoices/backend/feature';
import { JournalEntriesModule } from '@univeex/journal-entries/feature-api';
import { OrganizationSettings } from '@univeex/organizations/feature-api';
import { Invoice } from '@univeex/invoices/backend/feature';
import { CustomerContact } from './entities/customer-contact.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { CustomerGroup } from './entities/customer-group.entity';

import { CustomerGroupsController } from './customer-groups.controller';
import { CustomerGroupsService } from './customer-groups.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      CustomerPayment,
      CustomerPaymentLine,
      Invoice,
      OrganizationSettings,
      CustomerContact,
      CustomerAddress,
      CustomerGroup,
    ]),
    AuthModule,
    forwardRef(() => InvoicesModule),
    JournalEntriesModule,
  ],
  controllers: [
    CustomersController,
    CustomerPaymentsController,
    CustomerGroupsController,
  ],
  providers: [
    CustomersService,
    CustomerPaymentsService,
    CustomerGroupsService,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}