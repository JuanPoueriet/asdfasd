
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { Currency } from './entities/currency.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { ExchangeRatesService } from './exchange-rates.service';
import { ExchangeRatesController } from './exchange-rates.controller';
import { CurrencyRevaluationService } from '@univeex/batch-processes/feature-api';
import { Account } from '@univeex/chart-of-accounts/feature-api';
import { OrganizationSettings } from '@univeex/organizations/feature-api';
import { Journal, JournalEntriesModule } from '@univeex/journal-entries/feature-api';

import { AccountBalance } from '@univeex/chart-of-accounts/feature-api';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Currency,
      ExchangeRate,
      Account,
      OrganizationSettings,
      Journal,
      AccountBalance,
    ]),
    HttpModule,
    forwardRef(() => JournalEntriesModule),
  ],
  controllers: [CurrenciesController, ExchangeRatesController],
  providers: [
    CurrenciesService,
    ExchangeRatesService,
    CurrencyRevaluationService,
  ],
  exports: [CurrencyRevaluationService],
})
export class CurrenciesModule {}