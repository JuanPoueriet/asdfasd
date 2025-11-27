import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { TaxesService } from '@univeex/taxes/feature-api';
import { CreateTaxDto, UpdateTaxDto } from '@univeex/taxes/data-access';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from 'src/users/entities/user.entity/user.entity';

@Controller('taxes')
@UseGuards(JwtAuthGuard)
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Post()
  create(@Body() createTaxDto: CreateTaxDto, @CurrentUser() user: User) {
    return this.taxesService.create(createTaxDto, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.taxesService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.taxesService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaxDto: UpdateTaxDto, @CurrentUser() user: User) {
    return this.taxesService.update(id, updateTaxDto, user.organizationId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.taxesService.remove(id, user.organizationId);
  }
}
