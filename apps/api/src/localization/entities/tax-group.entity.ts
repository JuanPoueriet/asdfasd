import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tax } from '@univeex/taxes/data-access';

@Entity({ name: 'tax_groups' })
export class TaxGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  name: string;

   // @OneToMany(() => Tax, tax => tax.taxGroup)
  taxes: Tax[];
}