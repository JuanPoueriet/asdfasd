import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TreasuryService } from './treasury.service';
import { CreateBankTransferDto } from './dto/create-bank-transfer.dto';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from 'src/users/entities/user.entity/user.entity';

@Controller('treasury')
@UseGuards(JwtAuthGuard)
export class TreasuryController {
  constructor(private readonly treasuryService: TreasuryService) {}

  @Post('bank-transfers')
  create(@Body() dto: CreateBankTransferDto, @CurrentUser() user: User) {
    return this.treasuryService.createBankTransfer(dto, user.organizationId);
  }
}