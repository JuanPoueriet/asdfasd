
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from 'src/users/entities/user.entity/user.entity';
import { IntercompanyService } from './intercompany.service';
import { CreateIntercompanyTransactionDto } from './dto/create-intercompany-transaction.dto';

@Controller('intercompany')
@UseGuards(JwtAuthGuard)
export class IntercompanyController {
  constructor(private readonly intercompanyService: IntercompanyService) {}

  @Post('transactions')
  createTransaction(@Body() dto: CreateIntercompanyTransactionDto, @CurrentUser() user: User) {
    return this.intercompanyService.create(dto, user.organizationId);
  }
}