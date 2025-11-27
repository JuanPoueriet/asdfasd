import { Controller, Post, Body, UseGuards, Get, Patch, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@univeex/users/api-data-access';
import { SsoService } from './sso.service';
import { CreateSsoConfigDto, UpdateSsoConfigDto } from './dto/sso-config.dto';
import { HasPermission } from './decorators/permissions.decorator';
import { PERMISSIONS } from '@univeex/shared/util-common';

@Controller('admin/sso')
@UseGuards(JwtAuthGuard)
@HasPermission(PERMISSIONS.SETTINGS_MANAGE_SSO) // <-- ¡Permiso nuevo!
export class SsoAdminController {
  constructor(private readonly ssoService: SsoService) {}

  @Get()
  getConfigs(@CurrentUser() user: User) {
    return this.ssoService.getConfigsForOrg(user.organizationId);
  }

  @Post()
  createConfig(@Body() dto: CreateSsoConfigDto, @CurrentUser() user: User) {
    return this.ssoService.createConfig(dto, user.organizationId);
  }

  @Patch(':id')
  updateConfig(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSsoConfigDto,
    @CurrentUser() user: User
  ) {
    return this.ssoService.updateConfig(id, dto, user.organizationId);
  }

  @Delete(':id')
  deleteConfig(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ssoService.deleteConfig(id, user.organizationId);
  }
}
