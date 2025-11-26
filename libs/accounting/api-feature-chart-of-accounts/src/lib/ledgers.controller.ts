
import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/feature-api';
import { LedgersService } from './ledgers.service';
import { Ledger } from '@univeex/accounting/data-access';

@Controller('accounting/ledgers')
@UseGuards(JwtAuthGuard)
export class LedgersController {
  constructor(private readonly ledgersService: LedgersService) {}

  @Get('general-ledger')
  getGeneralLedger(
    @Query('accountId') accountId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: User,
  ) {
    return this.ledgersService.getGeneralLedger(
      user.organizationId,
      accountId,
      startDate,
      endDate,
    );
  }

  @Post()
  create(@Body() createDto: Partial<Ledger>, @CurrentUser() user: User) {
    return this.ledgersService.create(createDto, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.ledgersService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ledgersService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<Ledger>,
    @CurrentUser() user: User,
  ) {
    return this.ledgersService.update(id, updateDto, user.organizationId);
  }
}