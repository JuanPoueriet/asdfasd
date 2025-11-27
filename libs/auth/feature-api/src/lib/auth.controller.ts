import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@univeex/users/api-data-access';
import { Throttle } from '@nestjs/throttler';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetPasswordFromInvitationDto } from './dto/set-password-from-invitation.dto';
import { ConfigService } from '@nestjs/config';
import { VerifyMfaLoginDto } from './dto/mfa.dto'; // <-- NUEVA IMPORTACIÓN

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @UseGuards(GoogleRecaptchaGuard)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(GoogleRecaptchaGuard)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // --- CORRECCIÓN ---
    // Se llama al servicio con ambos argumentos (dto y res)
    // El servicio devuelve { user: ... } o { mfaRequired: true, ... }
    // Ya no se desestructuran 'accessToken' ni 'refreshToken' aquí.
    return this.authService.login(loginUserDto, res);
  }

  // --- INICIO: NUEVO ENDPOINT PARA PASO 2 DE MFA ---
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async verifyMfa(
    @Body() verifyDto: VerifyMfaLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { mfaToken, mfaCode, rememberMe } = verifyDto;
    
    // Este servicio valida los tokens y, si es exitoso,
    // establece las cookies de sesión y devuelve al usuario.
    return this.authService.verifyMfaAndLogin(mfaToken, mfaCode, rememberMe ?? false, res);
  }
  // --- FIN: NUEVO ENDPOINT PARA PASO 2 DE MFA ---

  @Post('set-password-from-invitation')
  @HttpCode(HttpStatus.OK)
  async setPasswordFromInvitation(
    @Body() setPasswordDto: SetPasswordFromInvitationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.setPasswordFromInvitation(setPasswordDto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { user };
  }


  @Get('invitation/:token')
  @HttpCode(HttpStatus.OK)
  async getInvitationDetails(@Param('token') token: string) {
    return this.authService.getInvitationDetails(token);
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new BadRequestException('Refresh token no encontrado en cookies');
    }

    const { user, accessToken } =
      await this.authService.refreshAccessToken(refreshToken);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax', // Ajustado para desarrollo
      maxAge: 15 * 60 * 1000,
    });

    return { user }; // Devuelve el usuario junto con el token
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    // Modificado para llamar al servicio
    return this.authService.logout(res);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  checkAuthStatus(@CurrentUser() user: User) {
    return this.authService.status(user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleRecaptchaGuard)
  @UsePipes(new ValidationPipe())
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.sendPasswordResetLink(forgotPasswordDto);
    return {
      message:
        'Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const user = await this.authService.resetPassword(resetPasswordDto);
    const { passwordHash, ...userResult } = user;
    return userResult;
  }


  @Post('impersonate')
  @UseGuards(JwtAuthGuard)
  async impersonate(
    @CurrentUser() adminUser: User,
    @Body('userId') targetUserId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.impersonate(adminUser, targetUserId);
    
    this._setAuthCookies(res, accessToken, refreshToken, false);

    return { user };
  }

  @Post('stop-impersonation')
  @UseGuards(JwtAuthGuard)
  async stopImpersonation(
    @CurrentUser() impersonatingUser: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.stopImpersonation(impersonatingUser);
    
    this._setAuthCookies(res, accessToken, refreshToken, false);

    return { user };
  }

  // Helper privado para setear cookies
  private _setAuthCookies(
    res: Response, 
    accessToken: string, 
    refreshToken: string, 
    rememberMe: boolean = false
  ) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000, // 30 días o 1 día
    });
  }
}
