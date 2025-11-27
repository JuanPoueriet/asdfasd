import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxesController } from './taxes.controller';
import { AuthModule } from '@univeex/auth/feature-api';
import { UsersModule } from '@univeex/users/api-feature';
import { Tax, TaxCategory, TaxConfiguration, TaxRule } from '@univeex/taxes/data-access';
import { TaxesService } from './taxes.service';
import { TaxCalculationService } from './tax-calculation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tax,
      TaxCategory,
      TaxConfiguration,
      TaxRule,
    ]),
    AuthModule,
    UsersModule
  ],
  controllers: [TaxesController],
  providers: [TaxesService, TaxCalculationService],
  exports: [TaxesService, TaxCalculationService],
})
export class TaxesModule {}
