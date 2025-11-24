import { Organization } from 'src/organizations/entities/organization.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

export enum SsoProviderType {
  SAML = 'SAML',
  OIDC = 'OIDC',
}

@Entity({ name: 'sso_configurations' })
@Index(['organizationId', 'isActive'])
export class SsoConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization, (org) => org.ssoConfigs)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: SsoProviderType, default: SsoProviderType.SAML })
  provider: SsoProviderType;

  @Column({
    name: 'issuer_url',
    unique: true,
    comment: 'El "Issuer" o "Entity ID" único del IdP. Se usa para encontrar esta config en el callback.',
  })
  issuerUrl: string;

  @Column({ name: 'entry_point_url', comment: 'La URL de login del IdP (IdP-initiated login)' })
  entryPointUrl: string;

  @Column({ type: 'text', comment: 'El certificado X.509 público del IdP' })
  certificate: string;

  @Column({
    name: 'identifier_format',
    nullable: true,
    default: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  })
  identifierFormat?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}