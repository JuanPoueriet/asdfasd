import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceLineItem } from './entities/invoice-line-item.entity';
import { InvoicesService } from './invoices.service';
import { InvoiceRemindersService } from './invoice-reminders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceLineItem])],
  providers: [InvoicesService, InvoiceRemindersService],
  exports: [InvoicesService, InvoiceRemindersService, TypeOrmModule],
})
export class InvoicesDataAccessModule {}
