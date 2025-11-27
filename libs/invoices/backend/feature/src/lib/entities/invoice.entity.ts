
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum InvoiceType {
  STANDARD = 'STANDARD',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  VOIDED = 'VOIDED',
  OVERDUE = 'OVERDUE'
}

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  // Mock relationship for compilation
  @ManyToOne('Customer', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: any;

  @Column({ type: 'date', name: 'issue_date' })
  issueDate: string;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ type: 'enum', enum: InvoiceType, default: InvoiceType.STANDARD })
  type: InvoiceType;

  @Column({ name: 'ncf_number', nullable: true })
  ncfNumber: string;

  @Column({ name: 'original_invoice_id', nullable: true })
  originalInvoiceId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
