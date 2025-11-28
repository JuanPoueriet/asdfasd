
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FiscalRegion } from './fiscal-region.entity';
import { TaxConfiguration } from '@univeex/taxes/data-access';

@Entity({ name: 'tax_schemes' })
export class TaxScheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'fiscal_region_id' })
  fiscalRegionId: string;

  @ManyToOne(() => FiscalRegion)
  @JoinColumn({ name: 'fiscal_region_id' })
  fiscalRegion: FiscalRegion;

  @Column('jsonb')
  configurations: TaxConfiguration[];
}
