import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// import { TaxGroup } from 'src/localization/entities/tax-group.entity';
// import { Organization } from 'src/organizations/entities/organization.entity';

export enum TaxType {
  PERCENTAGE = 'Porcentaje',
  FIXED = 'Fijo',
}

@Entity({ name: 'taxes' })
export class Tax {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  rate!: number;

  @Column({
    type: 'enum',
    enum: TaxType,
    default: TaxType.PERCENTAGE,
  })
  type!: TaxType;

  @Column({ nullable: true })
  countryCode?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'organization_id' })
  organizationId!: string;

  @ManyToOne("Organization", { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: any; // Type is loose to avoid circular dependency

  @ManyToOne("TaxGroup", (group: any) => group.taxes, { nullable: true })
  @JoinColumn({ name: 'tax_group_id' })
  taxGroup?: any;

  @Column({ name: 'tax_group_id', type: 'uuid', nullable: true })
  taxGroupId?: string;
}
