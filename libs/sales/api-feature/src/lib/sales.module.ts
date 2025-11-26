import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from 'src/customers/customers.module';
import { LeadsController } from './controllers/leads.controller';
import { OpportunitiesController } from './controllers/opportunities.controller';
import { Lead, Opportunity, Quote, QuoteLine, Activity } from '@univeex/sales/data-access';
import { LeadsService } from './services/leads.service';
import { OpportunitiesService } from './services/opportunities.service';

import { QuotesController } from './controllers/quotes.controller';
import { QuotesService } from './services/quotes.service';
import { SharedModule } from 'src/shared/shared.module';
import { InvoicesModule } from 'src/invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lead, 
      Opportunity,
      Quote,
      QuoteLine,
      Activity,
    ]),
    CustomersModule,
    SharedModule,
    InvoicesModule,
  ],
  controllers: [
    LeadsController, 
    OpportunitiesController,
    QuotesController,
  ],
  providers: [
    LeadsService, 
    OpportunitiesService,
    QuotesService,
  ],
})
export class SalesModule {}