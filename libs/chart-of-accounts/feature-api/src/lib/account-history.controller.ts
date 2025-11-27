
import { Controller, Get, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from 'src/users/entities/user.entity/user.entity';

@Controller('chart-of-accounts/:accountId/history')
@UseGuards(JwtAuthGuard)
export class AccountHistoryController {
  constructor(private readonly chartOfAccountsService: ChartOfAccountsService) {}

  @Get()
  findAccountHistory(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @CurrentUser() user: User,
  ) {
    return this.chartOfAccountsService.getAccountHistory(accountId, user.organizationId);
  }
}