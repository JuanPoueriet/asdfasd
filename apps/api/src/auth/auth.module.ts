import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import {
  GoogleRecaptchaModule,
  GoogleRecaptchaGuard,
} from '@nestlab/google-recaptcha';
import { HttpModule } from '@nestjs/axios'; // <-- Importar HttpModule

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { User } from '../users/entities/user.entity/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { MailModule } from '../mail/mail.module';
import { LocalizationModule } from 'src/localization/localization.module';
import { ChartOfAccountsModule } from 'src/chart-of-accounts/chart-of-accounts.module';

// --- INICIO: NUEVAS IMPORTACIONES ---
import { MfaService } from './mfa.service';
import { MfaController } from './mfa.controller';
import { SsoConfig } from './sso-config.entity';
import { SsoService } from './sso.service';
import { SsoAdminController } from './sso-admin.controller';
import { SsoController } from './sso.controller';
import { DynamicSamlStrategy } from './strategies/saml.strategy';
import { Role } from 'src/roles/entities/role.entity';
// --- FIN: NUEVAS IMPORTACIONES ---

@Module({
  imports: [
    ConfigModule,
    // --- Módulos actualizados ---
    TypeOrmModule.forFeature([User, Organization, SsoConfig, Role]), // <-- Añadir SsoConfig y Role
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION_TIME', '1h'),
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: Number(config.get('THROTTLE_TTL', 60)),
            limit: Number(config.get('THROTTLE_LIMIT', 10)),
          },
        ],
      }),
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secretKey: config.get<string>('RECAPTCHA_SECRET_KEY'),
        response: () =>
          config.get<string>('RECAPTCHA_RESPONSE', 'g-recaptcha-response'),
      }),
    }),
    MailModule,
    LocalizationModule,
    ChartOfAccountsModule,
    HttpModule, // <-- Añadir HttpModule
  ],
  // --- Controladores actualizados ---
  controllers: [
    AuthController,
    MfaController,
    SsoController,
    SsoAdminController,
  ],
  // --- Proveedores actualizados ---
  providers: [
    AuthService,
    JwtStrategy,
    GoogleRecaptchaGuard,
    MfaService,
    SsoService,
    DynamicSamlStrategy,
  ],
  exports: [
    AuthService,
    PassportModule,
    JwtModule,
    JwtStrategy,
    MfaService,
    SsoService,
  ],
})
export class AuthModule {}
