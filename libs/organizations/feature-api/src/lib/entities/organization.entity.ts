
import { User } from '@univeex/users/api-data-access';
import { SsoConfig } from '@univeex/auth/feature-api';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrganizationSubsidiary } from './organization-subsidiary.entity';
import { FiscalRegion } from '@univeex/localization/feature-api';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255 })
  legalName: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  rnc?: string | null;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl?: string;

  @Column({ name: 'accent_color', type: 'varchar', length: 7, nullable: true, default: '#0078d4' })
  accentColor?: string;

  @Column({ name: 'font_family', type: 'varchar', length: 50, nullable: true, default: 'Inter' })
  fontFamily?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];


  @Column({ name: 'fiscal_region_id', nullable: true })
  fiscalRegionId?: string;

  @ManyToOne(() => FiscalRegion)
  @JoinColumn({ name: 'fiscal_region_id' })
  fiscalRegion: FiscalRegion;


  @OneToMany(() => OrganizationSubsidiary, sub => sub.parent)
  subsidiaries: OrganizationSubsidiary[];

  @OneToMany(() => SsoConfig, (config) => config.organization)
  ssoConfigs: SsoConfig[];
}