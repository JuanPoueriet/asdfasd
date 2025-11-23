import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxesService } from './taxes.service';
import { TaxCalculationService } from './tax-calculation.service';
import { Tax, TaxCategory, TaxConfiguration, TaxRule } from '@univeex/taxes/data-access';
// import { Product } from 'src/inventory/entities/product.entity';
// import { Customer } from 'src/customers/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tax,
      TaxCategory,
      TaxConfiguration,
      TaxRule,
      // Product,
      // Customer
    ])
  ],
  controllers: [],
  providers: [TaxesService, TaxCalculationService],
  exports: [TaxesService, TaxCalculationService],
})
export class TaxesFeatureApiModule {}
