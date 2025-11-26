import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, ParseUUIDPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard, GetUser } from '@univeex/auth/feature-api';
import { UserPayload as jwtPayloadInterface } from '@univeex/users/domain';
import { ALL_PERMISSIONS } from '@univeex/shared/util-common';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('available-permissions')
  getAvailablePermissions() {
    return ALL_PERMISSIONS;
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @GetUser() user: jwtPayloadInterface) {
    return this.rolesService.create(createRoleDto, user.organizationId);
  }

  @Post('clone/:id')
  clone(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: jwtPayloadInterface) {
    return this.rolesService.cloneRole(id, user.organizationId);
  }

  @Get()
  findAll(@GetUser() user: jwtPayloadInterface) {
    return this.rolesService.findAllByOrg(user.organizationId);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto, @GetUser() user: jwtPayloadInterface) {
    return this.rolesService.update(id, updateRoleDto, user.organizationId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: jwtPayloadInterface) {
    return this.rolesService.remove(id, user.organizationId);
  }
}