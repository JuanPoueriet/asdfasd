import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard, GetUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/domain';

@Controller('chart-of-accounts')
@UseGuards(JwtAuthGuard)
export class ChartOfAccountsController {
  constructor(private readonly chartOfAccountsService: ChartOfAccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @GetUser() user: User) {
    return this.chartOfAccountsService.create(createAccountDto, user.organizationId);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.chartOfAccountsService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.chartOfAccountsService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAccountDto: UpdateAccountDto, @GetUser() user: User) {
    return this.chartOfAccountsService.update(id, updateAccountDto, user.organizationId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.chartOfAccountsService.remove(id, user.organizationId);
  }
}
