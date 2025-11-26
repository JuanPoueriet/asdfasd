import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AccountType } from '@univeex/chart-of-accounts/domain';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: AccountType })
  type: AccountType;

  @Column({ default: false })
  isTaxAccount: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column()
  organizationId: string;
}
