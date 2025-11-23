import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { CreateTaxDto, UpdateTaxDto } from '@univeex/taxes/data-access';
// import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
// import { User } from 'src/users/entities/user.entity/user.entity';

// TODO: Restore Auth when Auth domain is migrated to libs/auth
// @UseGuards(JwtAuthGuard)
@Controller('taxes')
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Post()
  create(@Body() createTaxDto: CreateTaxDto, @Body('user') user: any) {
    // TODO: Replace 'any' with proper User interface from shared libs
    return this.taxesService.create(createTaxDto, user?.organizationId);
  }

  @Get()
  findAll(@Body('user') user: any) {
     // TODO: Replace 'any' with proper User interface from shared libs
    return this.taxesService.findAll(user?.organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Body('user') user: any) {
     // TODO: Replace 'any' with proper User interface from shared libs
    return this.taxesService.findOne(id, user?.organizationId);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaxDto: UpdateTaxDto, @Body('user') user: any) {
     // TODO: Replace 'any' with proper User interface from shared libs
    return this.taxesService.update(id, updateTaxDto, user?.organizationId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Body('user') user: any) {
     // TODO: Replace 'any' with proper User interface from shared libs
    return this.taxesService.remove(id, user?.organizationId);
  }
}
