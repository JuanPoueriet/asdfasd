
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceService } from './compliance.service';
import { NcfSequence } from './entities/ncf-sequence.entity';

import { VendorBill } from '@univeex/accounts-payable/feature-api';
import { Invoice } from '@univeex/invoices/backend/feature';


@Module({

  imports: [TypeOrmModule.forFeature([NcfSequence, VendorBill, Invoice])],

  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}