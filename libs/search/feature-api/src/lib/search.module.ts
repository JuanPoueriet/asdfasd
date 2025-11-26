import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { InvoicesModule } from '@univeex/invoices/backend/feature';
import { InventoryModule } from '@univeex/inventory/feature-api';
import { CustomersModule } from '@univeex/customers/feature-api';

@Module({
  imports: [InvoicesModule, InventoryModule, CustomersModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}