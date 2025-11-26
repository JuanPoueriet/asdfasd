

import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Param,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/backend/data-access';
import { UsersApplicationService } from './users.application.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersApplicationService: UsersApplicationService) {}


  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchTerm') searchTerm?: string,
    @Query('statusFilter') statusFilter?: string,
    @Query('sortColumn') sortColumn?: string,
    @Query('sortDirection') sortDirection?: 'ASC' | 'DESC',
  ) {
    const options = {
      page: +page,
      pageSize: +pageSize,
      searchTerm,
      statusFilter,
      sortColumn,
      sortDirection,
    };
    return this.usersApplicationService.findAllByOrg(user.organizationId, options);
  }


  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {

    return this.usersApplicationService.updateUser(id, updateUserDto, user.organizationId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.usersApplicationService.remove(id, user.organizationId);
  }

  @Post('invite')
  async invite(
    @Body() inviteUserDto: InviteUserDto,
    @CurrentUser() user: User,
  ): Promise<User> {



    const organizationId = user.organizationId;
    return this.usersApplicationService.inviteUser(inviteUserDto, organizationId);
  }

  @Post(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  async sendPasswordReset(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.usersApplicationService.resetPassword(id, user.organizationId);
    return { message: 'Password reset email sent successfully.' };
  }

   @Post(':id/force-logout')
  @HttpCode(HttpStatus.OK)
  async forceLogout(@Param('id') id: string, @CurrentUser() admin: User) {

    return this.usersApplicationService.forceLogout(id);
  }

  @Post(':id/block-and-logout')
  @HttpCode(HttpStatus.OK)
  async blockAndLogout(@Param('id') id: string, @CurrentUser() admin: User) {
    return this.usersApplicationService.blockAndLogout(id);
  }
  
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async setOnlineStatus(
    @Param('id') id: string,
    @Body('isOnline') isOnline: boolean,
  ): Promise<User> {
    return this.usersApplicationService.setOnlineStatus(id, isOnline);
  }
}