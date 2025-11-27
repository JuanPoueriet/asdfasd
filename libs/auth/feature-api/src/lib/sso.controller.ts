import { Controller, Get, Post, Req, Res, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express'; // <-- CORRECCIÓN
import { AuthService } from './auth.service';
import { User } from '@univeex/users/api-data-access';

@Controller('auth/sso')
export class SsoController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Inicia el flujo de login SAML.
   * El usuario es redirigido al IdP.
   * Usamos 'slug' como un identificador único de la organización en la URL.
   */
  @Get('login')
  @UseGuards(AuthGuard('saml'))
  initiateSso(@Query('slug') slug: string) {
    // Passport se encarga de la redirección
    // El 'slug' es recogido por getSamlOptions en la estrategia
  }

  /**
   * Maneja el callback del IdP (POST).
   * Passport-saml valida la respuesta y nuestra estrategia 'validate' crea/busca al usuario.
   */
  @Post('callback')
  @UseGuards(AuthGuard('saml'))
  async handleSsoCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    
    // El usuario está validado y provisionado.
    // Ahora generamos nuestros tokens de sesión (JWT) y establecemos las cookies.
    await this.authService.handleSsoLogin(user, res); // <-- CORRECCIÓN (Asegúrate que auth.service.ts tenga este método)

    // Redirigir al usuario al dashboard del frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    res.redirect(`${frontendUrl}/dashboard`);
  }
}
