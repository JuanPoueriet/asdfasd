import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard, GetUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/domain';

@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('ledgers')
  findAllLedgers(@GetUser() user: User) {
    return this.accountingService.findAllLedgers(user.organizationId);
  }
}
