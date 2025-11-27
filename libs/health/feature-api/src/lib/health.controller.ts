
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { BalanceUpdateService } from '@univeex/chart-of-accounts/feature-api';

@Controller('health')
export class HealthController {
  constructor(private readonly balanceUpdateService: BalanceUpdateService) {}

  @Get('queues')
  @UseGuards(JwtAuthGuard)
  async getQueueHealth() {
    return this.balanceUpdateService.getQueueStatus();
  }
}