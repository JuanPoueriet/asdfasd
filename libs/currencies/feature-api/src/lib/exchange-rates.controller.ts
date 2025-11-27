
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { ExchangeRatesService } from './exchange-rates.service';

@Controller('exchange-rates')
@UseGuards(JwtAuthGuard)
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Post('update')
  updateRates() {
    return this.exchangeRatesService.updateRates();
  }
}