import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard, GetUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/domain';

@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto, @GetUser() user: User) {
    return this.suppliersService.create(createSupplierDto, user.organizationId);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.suppliersService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.suppliersService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @GetUser() user: User,
  ) {
    return this.suppliersService.update(id, updateSupplierDto, user.organizationId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.suppliersService.remove(id, user.organizationId);
  }
}