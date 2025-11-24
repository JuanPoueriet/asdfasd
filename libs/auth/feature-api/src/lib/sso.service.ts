import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm'; // <-- Importar DeepPartial
import { SsoConfig, SsoProviderType } from './sso-config.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { CreateSsoConfigDto, UpdateSsoConfigDto } from './dto/sso-config.dto';
import { User, UserStatus } from '@univeex/users/feature-api';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class SsoService {
  constructor(
    @InjectRepository(SsoConfig)
    public readonly ssoConfigRepository: Repository<SsoConfig>, // <-- CORRECCIÓN: de private a public
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // --- Lógica de Admin (CRUD) ---

  async getConfigsForOrg(organizationId: string): Promise<SsoConfig[]> {
    return this.ssoConfigRepository.find({ where: { organizationId } });
  }

  async createConfig(dto: CreateSsoConfigDto, organizationId: string): Promise<SsoConfig> {
    const org = await this.orgRepository.findOneBy({ id: organizationId });
    if (!org) throw new NotFoundException('Organización no encontrada');

    const config = this.ssoConfigRepository.create({ ...dto, organizationId });
    return this.ssoConfigRepository.save(config);
  }
  
  async updateConfig(id: string, dto: UpdateSsoConfigDto, organizationId: string): Promise<SsoConfig> {
    const config = await this.ssoConfigRepository.findOneBy({ id, organizationId });
    if (!config) throw new NotFoundException('Configuración SSO no encontrada');
    
    Object.assign(config, dto);
    return this.ssoConfigRepository.save(config);
  }

  async deleteConfig(id: string, organizationId: string): Promise<void> {
    const result = await this.ssoConfigRepository.delete({ id, organizationId });
    if (result.affected === 0) {
      throw new NotFoundException('Configuración SSO no encontrada');
    }
  }

  // --- Lógica de Estrategia ---

  /**
   * Busca la configuración SSO activa basada en el slug de la organización (para iniciar el login).
   */
  async getConfigForInitiation(organizationSlug: string): Promise<SsoConfig> {
    // Esto asume que tienes un campo 'slug' en tu entidad Organization.
    // Si no lo tienes, deberás usar el ID de la organización.
    const config = await this.ssoConfigRepository.findOne({
      where: {
        organization: { legalName: organizationSlug }, // Simulación, deberías tener un 'slug'
        isActive: true,
      },
    });

    if (!config) {
      throw new NotFoundException(`No se encontró configuración SSO activa para ${organizationSlug}`);
    }
    return config;
  }

  /**
   * Busca la configuración SSO activa basada en el Issuer del IdP (para el callback).
   */
  async getConfigForCallback(issuer: string): Promise<SsoConfig> {
    const config = await this.ssoConfigRepository.findOne({
      where: { issuerUrl: issuer, isActive: true },
      relations: ['organization'], // <-- Asegurarse de cargar la organización
    });

    if (!config) {
      throw new NotFoundException(`No se encontró configuración SSO para el issuer ${issuer}`);
    }
    return config;
  }

  /**
   * Lógica de Provisión Just-In-Time (JIT) para usuarios SSO.
   */
  async findOrCreateUserFromSaml(profile: any, config: SsoConfig): Promise<User> {
    const email = profile.email || profile.nameID;
    if (!email) {
      throw new BadRequestException('El perfil SAML no contiene un email o nameID.');
    }
    
    const organizationId = config.organizationId;

    let user = await this.userRepository.findOne({
      where: { email, organizationId },
      relations: ['roles', 'organization'],
    });

    if (user) {
      // Usuario existe, solo verificamos su estado
      if (user.status !== UserStatus.ACTIVE) {
        throw new BadRequestException(`El usuario ${email} está inactivo o bloqueado.`);
      }
      return user;
    }

    // Usuario no existe, lo creamos (JIT Provisioning)
    const defaultRole = await this.roleRepository.findOne({
      where: { organizationId, name: 'MEMBER' }, // Asigna el rol de 'Miembro' por defecto
    });
    
    if (!defaultRole) {
      throw new NotFoundException(`No se encontró el rol "MEMBER" por defecto para la organización ${organizationId}`);
    }

    // --- CORRECCIÓN INICIO ---
    const newUserPayload: DeepPartial<User> = {
      email,
      firstName: profile.firstName || 'Usuario',
      lastName: profile.lastName || 'SSO',
      organizationId,
      organization: config.organization,
      status: UserStatus.ACTIVE,
      roles: [defaultRole],
      passwordHash: null, // <-- Esto ahora es válido gracias al cambio en user.entity.ts
    };

    const newUser = this.userRepository.create(newUserPayload);
    const savedUser = await this.userRepository.save(newUser);

    // Re-asignar relaciones que pueden perderse en el 'save' si no se manejan en cascada
    savedUser.organization = config.organization;
    savedUser.roles = [defaultRole];
    
    return savedUser;
    // --- CORRECIÓN FIN ---
  }
}