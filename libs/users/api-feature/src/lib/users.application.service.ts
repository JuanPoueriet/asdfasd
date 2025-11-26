import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UsersService, UserStatus } from '@univeex/users/backend/data-access';
import { RolesService } from '@univeex/roles/feature-api';
import { MailService } from '@univeex/mail/feature-api';
import { EventsGateway } from '@univeex/websockets/feature-api';
import { UpdateUserDto, InviteUserDto } from '@univeex/users/api-data-access';
import * as crypto from 'crypto';

@Injectable()
export class UsersApplicationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly mailService: MailService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findAllByOrg(
    organizationId: string,
    options: {
      page: number;
      pageSize: number;
      searchTerm?: string;
      statusFilter?: string;
      sortColumn?: string;
      sortDirection?: 'ASC' | 'DESC';
    },
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.findAllByOrg(organizationId, options);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    organizationId: string,
  ): Promise<User> {
    const user = await this.usersService.findOneByOrg(id, organizationId);
    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${id} no encontrado en tu organización.`,
      );
    }

    const { roleId, ...userData } = updateUserDto;

    if (roleId) {
      const role = await this.rolesService.findOne(roleId, organizationId);
      if (!role) {
        throw new NotFoundException(`Rol con ID ${roleId} no encontrado.`);
      }
      user.roles = [role];
    }

    return this.usersService.update(id, {...user, ...userData});
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const user = await this.usersService.findOneByOrg(id, organizationId);

    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${id} no encontrado en tu organización.`,
      );
    }

    const isSystemUser = user.roles.some((role) => role.isSystemRole);
    if (isSystemUser) {
      throw new ForbiddenException(
        'No se puede eliminar un usuario con un rol de sistema.',
      );
    }

    await this.usersService.remove(id);
  }

  async inviteUser(
    inviteUserDto: InviteUserDto,
    organizationId: string,
  ): Promise<User> {
    const { email, firstName, lastName, roleId } = inviteUserDto;

    const existingUser = await this.usersService.findOneByEmail(email);

    if (existingUser && existingUser.organizationId === organizationId) {
      throw new BadRequestException(
        'A user with this email already exists in the organization.',
      );
    }

    const role = await this.rolesService.findOne(roleId, organizationId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found.`);
    }

    const invitationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setDate(tokenExpires.getDate() + 7);

    const newUser = await this.usersService.create({
      firstName,
      lastName,
      email,
      organization: { id: organizationId },
      roles: [role],
      status: UserStatus.PENDING,
      invitationToken: invitationToken,
      invitationTokenExpires: tokenExpires,
    });

    await this.mailService.sendUserInvitation(newUser, invitationToken);

    delete newUser.invitationToken;
    delete newUser.invitationTokenExpires;

    return newUser;
  }

  async resetPassword(id: string, organizationId: string): Promise<void> {
    const user = await this.usersService.findOneByOrg(id, organizationId);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetExpires = new Date(Date.now() + 3600000);

    await this.usersService.update(id, user);

    try {
      await this.mailService.sendPasswordResetEmail(user, resetToken, '1h');
    } catch (error) {
      console.error(
        `Failed to send password reset email to ${user.email}`,
        error,
      );

      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await this.usersService.update(id, user);

      throw new Error(
        'Could not send password reset email. Please try again later.',
      );
    }
  }

  async forceLogout(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.tokenVersion += 1;
    await this.usersService.update(userId, user);

    this.eventsGateway.sendToUser(userId, 'force-logout', {
      reason: 'Su sesión ha sido cerrada por un administrador.',
    });

    return { message: 'Se ha cerrado la sesión del usuario.' };
  }

  async blockAndLogout(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.status = UserStatus.BLOCKED;
    user.tokenVersion += 1;
    await this.usersService.update(userId, user);

    this.eventsGateway.sendToUser(userId, 'force-logout', {
      reason:
        'Su cuenta ha sido bloqueada y su sesión ha sido cerrada por un administrador.',
    });

    return { message: 'Se ha bloqueado y cerrado la sesión del usuario.' };
  }
  
  async setOnlineStatus(userId: string, isOnline: boolean): Promise<User> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    user.isOnline = isOnline;
    const updatedUser = await this.usersService.update(userId, user);
    this.eventsGateway.server.emit('user-status-update', { userId, isOnline });
    return updatedUser;
  }
}
