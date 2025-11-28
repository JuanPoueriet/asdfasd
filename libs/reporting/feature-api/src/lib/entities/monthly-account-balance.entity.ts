
import { Account } from '@univeex/chart-of-accounts/feature-api';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity({ name: 'monthly_account_balances' })
@Index(['organizationId', 'period'])
export class MonthlyAccountBalance {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ length: 7 }) // Format: YYYY-MM
  period: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  beginningBalance: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  debitAmount: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  creditAmount: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  endingBalance: number;
}
