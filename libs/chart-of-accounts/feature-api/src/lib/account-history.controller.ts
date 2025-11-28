
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';
import { JwtAuthGuard } from '@univeex/auth/feature-api';

@Controller('chart-of-accounts/:accountId/history')
@UseGuards(JwtAuthGuard)
export class AccountHistoryController {
  constructor(private readonly chartOfAccountsService: ChartOfAccountsService) {}

  @Get()
  getAccountHistory(
    @Param('accountId') accountId: string,
    @CurrentUser() user: User,
  ) {
    return this.chartOfAccountsService.getAccountHistory(
      accountId,
      user.organizationId,
    );
  }
}
