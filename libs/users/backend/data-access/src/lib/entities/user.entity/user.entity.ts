import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Organization } from '@univeex/organizations/feature-api';
import { Role } from '@univeex/roles/feature-api';

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  BLOCKED = 'BLOCKED',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  passwordHash: string | null; // <-- CORRECCIÓN
  
  // --- INICIO: NUEVOS CAMPOS PARA MFA ---

  @Column({ name: 'is_mfa_enabled', default: false })
  isMfaEnabled: boolean;

  @Column({ name: 'mfa_secret', type: 'varchar', nullable: true, select: false })
  mfaSecret?: string | null;
  
  @Column({ name: 'mfa_recovery_codes', type: 'simple-array', nullable: true, select: false })
  mfaRecoveryCodes?: string[] | null;

  // --- FIN: NUEVOS CAMPOS PARA MFA ---

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    name: 'token_version',
    type: 'integer',
    default: 0,
    comment: 'Incrementado para invalidar todos los JWT emitidos previamente.',
  })
  tokenVersion: number;

  @Column({ name: 'failed_login_attempts', type: 'integer', default: 0 })
  failedLoginAttempts: number;

  @Column({ name: 'lockout_until', type: 'timestamptz', nullable: true })
  lockoutUntil: Date | null;

  @Column({
    name: 'password_reset_token',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  passwordResetToken?: string | null;

  @Column({ name: 'password_reset_expires', type: 'timestamp', nullable: true })
  passwordResetExpires?: Date | null;

  @Column({ name: 'is_online', default: false })
  isOnline: boolean;

  @Column({ name: 'last_activity', type: 'timestamptz', nullable: true })
  lastActivity?: Date;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization, (org) => org.users)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  permissions?: string[];

  isImpersonating?: boolean;
  originalUserId?: string;

  @Column({ name: 'preferred_language', length: 5, nullable: true, default: 'es' })
  preferredLanguage?: string;

  @Column({ nullable: true })
  invitationToken?: string;

  @Column({ type: 'timestamptz', nullable: true })
  invitationTokenExpires?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}