import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as SamlStrategy } from 'passport-saml';
import { Request } from 'express';
import { SsoService } from '../sso.service';
import * as xml2js from 'xml2js';

@Injectable()
export class DynamicSamlStrategy extends PassportStrategy(SamlStrategy, 'saml') {
  constructor(private readonly ssoService: SsoService) {
    // --- CORRECCIÓN ---
    // Combinamos ambas soluciones:
    // 1. Pasamos las opciones dinámicas (getSamlOptions).
    // 2. Pasamos los placeholders (issuer, callbackUrl, cert) para el constructor.
    // 3. Forzamos el tipo a 'any' para evitar el error de TypeScript sobre 'getSamlOptions'.
    super({
      passReqToCallback: true,
      getSamlOptions: (req: Request, done: Function) => {
        this.loadSamlOptions(req)
          .then(opts => done(null, opts))
          .catch(err => done(err));
      },

      // Placeholders para satisfacer el constructor al inicio
      issuer: 'placeholder-issuer',
      callbackUrl: 'http://localhost:3000/api/v1/auth/sso/callback',
      cert: 'dummy-cert-placeholder-to-avoid-startup-error',
      
    } as any); // <-- El 'as any' es crucial aquí.
  }

  private async loadSamlOptions(req: Request) {
    let config;
    if (req.body && req.body.SAMLResponse) {
      // --- Lógica de CALLBACK (POST) ---
      // La respuesta SAML está en el body. Necesitamos parsear el XML (sin verificar)
      // solo para encontrar el <Issuer> y así saber qué config de BDD usar.
      const xml = Buffer.from(req.body.SAMLResponse, 'base64').toString('utf8');
      const issuer = await this.getIssuerFromSaml(xml);
      if (!issuer) {
        throw new Error('No se pudo encontrar el Issuer en la respuesta SAML.');
      }
      config = await this.ssoService.getConfigForCallback(issuer);
      
    } else if (req.query.slug) {
      // --- Lógica de INICIO (GET) ---
      // El usuario está iniciando el login. Usamos el slug de la URL.
      const orgSlug = req.query.slug as string;
      config = await this.ssoService.getConfigForInitiation(orgSlug);
    } else {
      throw new Error('No se pudo determinar la configuración SSO. Falta el slug de la organización o la respuesta SAML.');
    }
    
    // Devolvemos las opciones de SAML dinámicamente
    return {
      issuer: config.issuerUrl,
      entryPoint: config.entryPointUrl,
      cert: config.certificate, // El certificado público del IdP
      callbackUrl: `${process.env.API_URL || 'http://localhost:3000'}/api/v1/auth/sso/callback`,
      identifierFormat: config.identifierFormat,
      acceptedClockSkewMs: 60000,
      // Almacenamos el ID de la org en el req para usarlo en 'validate'
      organizationId: config.organizationId, 
    };
  }

  /**
   * Esta función se llama DESPUÉS de que passport-saml ha validado la respuesta.
   * Recibimos el perfil del usuario (profile) y lo provisionamos.
   */
  async validate(req: Request, profile: any, done: Function) {
    try {
      const samlOptions: any = (req as any)._samlOptions;
      if (!samlOptions || !samlOptions.organizationId) {
        throw new UnauthorizedException('No se pudo verificar la organización de la sesión SAML.');
      }
      
      const config = await this.ssoService.ssoConfigRepository.findOneByOrFail({ 
        organizationId: samlOptions.organizationId, 
        issuerUrl: profile.issuer 
      });

      const user = await this.ssoService.findOrCreateUserFromSaml(profile, config);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }

  /**
   * Helper para parsear el Issuer del XML sin validarlo.
   */
  private async getIssuerFromSaml(xml: string): Promise<string | null> {
    try {
      const parsed = await xml2js.parseStringPromise(xml);
      // Navega el árbol XML para encontrar el Issuer
      const response = parsed['saml2p:Response'] || parsed['samlp:Response'];
      const issuer = response['saml2:Issuer'] || response['saml:Issuer'];
      return issuer[0]._;
    } catch (e) {
      console.error("Error parseando SAML para Issuer", e);
      return null;
    }
  }
}