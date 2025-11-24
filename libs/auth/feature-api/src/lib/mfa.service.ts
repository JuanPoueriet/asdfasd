import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { User } from '@univeex/users/feature-api';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name); // Añadido Logger

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Genera un nuevo secreto TOTP y la URL del código QR.
   */
  async setupMfa(user: User): Promise<{ secret: string; qrCodeDataUrl: string }> {
    const appName = this.configService.get<string>('APP_NAME', 'ERP_Platform');
    
    // Genera un secreto compatible con Google Authenticator
    const secret = speakeasy.generateSecret({
      name: `${appName} (${user.email})`,
    });

    // --- CORRECCIÓN INICIO ---
    if (!secret.otpauth_url) {
        throw new InternalServerErrorException('No se pudo generar la URL de otpauth para la configuración de MFA.');
    }

    let qrCodeDataUrl: string;
    try {
        qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);
    } catch (error) {
        this.logger.error('No se pudo generar la URL de datos del código QR', error);
        throw new InternalServerErrorException('No se pudo generar el código QR para la configuración de MFA.');
    }
    // --- CORRECCIÓN FIN ---
    
    // Guardamos el secreto temporalmente para la verificación
    // En un escenario real, esto podría ser encriptado.
    user.mfaSecret = secret.base32;
    await this.userRepository.save(user);

    return { secret: secret.base32, qrCodeDataUrl };
  }

  /**
   * Verifica un código TOTP contra el secreto guardado de un usuario.
   */
  isMfaCodeValid(mfaCode: string, user: User): boolean {
    if (!user.mfaSecret) {
      return false;
    }

    return speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaCode,
      window: 1, // Permite una deriva de 1x30 segundos
    });
  }

  /**
   * Genera un set de códigos de recuperación de un solo uso.
   */
  generateRecoveryCodes(user: User): string[] {
    // Genera 10 códigos de 10 caracteres
    const recoveryCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 12).toUpperCase()
    );
    
    // En producción, estos códigos deben ser hasheados antes de guardarse.
    // user.mfaRecoveryCodes = await Promise.all(codes.map(code => bcrypt.hash(code, 10)));
    
    // Por simplicidad, los guardamos en texto plano (NO RECOMENDADO PARA PRODUCCIÓN)
    user.mfaRecoveryCodes = recoveryCodes;
    
    return recoveryCodes;
  }

  /**
   * Valida un código de recuperación y lo elimina si se usa.
   */
  async useRecoveryCode(code: string, user: User): Promise<boolean> {
    if (!user.mfaRecoveryCodes || user.mfaRecoveryCodes.length === 0) {
      return false;
    }
    
    // En producción, habría que hashear el 'code' y compararlo con los hashes
    const codeIndex = user.mfaRecoveryCodes.indexOf(code);

    if (codeIndex > -1) {
      // Elimina el código usado
      user.mfaRecoveryCodes.splice(codeIndex, 1);
      await this.userRepository.save(user);
      return true;
    }
    
    return false;
  }
}