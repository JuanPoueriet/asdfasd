import { Controller, Post, Body, UseGuards, Get, Res, HttpCode, HttpStatus, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@univeex/users/feature-api';
import { MfaService } from './mfa.service';
import { EnableMfaDto, DisableMfaDto } from './dto/mfa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Controller('auth/mfa')
@UseGuards(JwtAuthGuard) // Proteger todos los endpoints de este controlador
export class MfaController {
  constructor(
    private readonly mfaService: MfaService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Get('setup')
  @HttpCode(HttpStatus.OK)
  async setupMfa(@CurrentUser() user: User) {
    if (user.isMfaEnabled) {
      throw new ForbiddenException('MFA ya está habilitado.');
    }
    // Cargar el usuario con el secreto (que está con select: false)
    const userWithSecret = await this.userRepository.findOne({
        where: { id: user.id },
        select: ['id', 'email', 'mfaSecret', 'isMfaEnabled']
    });
    if(!userWithSecret) throw new NotFoundException("Usuario no encontrado");

    const { qrCodeDataUrl } = await this.mfaService.setupMfa(userWithSecret);
    return { qrCodeDataUrl };
  }

  @Post('enable')
  @HttpCode(HttpStatus.OK)
  async enableMfa(@CurrentUser() user: User, @Body() body: EnableMfaDto) {
    if (user.isMfaEnabled) {
      throw new ForbiddenException('MFA ya está habilitado.');
    }
    
    const userWithSecret = await this.userRepository.findOne({
        where: { id: user.id },
        select: ['id', 'mfaSecret', 'isMfaEnabled', 'mfaRecoveryCodes']
    });
    if(!userWithSecret) throw new NotFoundException("Usuario no encontrado");

    const isValid = this.mfaService.isMfaCodeValid(body.mfaCode, userWithSecret);
    if (!isValid) {
      throw new ForbiddenException('Código MFA inválido.');
    }

    userWithSecret.isMfaEnabled = true;
    const recoveryCodes = this.mfaService.generateRecoveryCodes(userWithSecret);
    
    await this.userRepository.save(userWithSecret);

    return { 
      message: 'MFA habilitado exitosamente. Guarda tus códigos de recuperación.',
      recoveryCodes: recoveryCodes, // Mostrar los códigos al usuario UNA SOLA VEZ
    };
  }

  @Post('disable')
  @HttpCode(HttpStatus.OK)
  async disableMfa(@CurrentUser() user: User, @Body() body: DisableMfaDto) {
    const userWithDetails = await this.userRepository.findOne({
        where: { id: user.id },
        select: ['id', 'passwordHash', 'isMfaEnabled', 'mfaSecret', 'mfaRecoveryCodes']
    });
    if (!userWithDetails) throw new NotFoundException("Usuario no encontrado");
    if (!userWithDetails.isMfaEnabled) {
      throw new ForbiddenException('MFA no está habilitado.');
    }

    const isRecoveryCode = await this.mfaService.useRecoveryCode(body.passwordOrRecoveryCode, userWithDetails);
    const isPasswordValid = userWithDetails.passwordHash ? await bcrypt.compare(body.passwordOrRecoveryCode, userWithDetails.passwordHash) : false;

    if (!isRecoveryCode && !isPasswordValid) {
        throw new ForbiddenException('Contraseña o código de recuperación inválido.');
    }

    userWithDetails.isMfaEnabled = false;
    userWithDetails.mfaSecret = null;
    userWithDetails.mfaRecoveryCodes = null;
    await this.userRepository.save(userWithDetails);

    return { message: 'MFA deshabilitado exitosamente.' };
  }
}