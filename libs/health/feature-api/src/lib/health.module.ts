
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ChartOfAccountsModule } from '@univeex/chart-of-accounts/feature-api';

@Module({
  imports: [ChartOfAccountsModule],
  controllers: [HealthController],
})
export class HealthModule {}