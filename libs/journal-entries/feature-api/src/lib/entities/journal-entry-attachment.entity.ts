
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { User } from '@univeex/users/api-data-access';

@Entity({ name: 'journal_entry_attachments' })
export class JournalEntryAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'journal_entry_id' })
  journalEntryId: string;

  @ManyToOne(() => JournalEntry, (entry) => entry.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry: JournalEntry;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ name: 'file_size' })
  fileSize: number;

  @Column({ name: 'storage_key' })
  storageKey: string;

  @Column({ name: 'uploaded_by_user_id' })
  uploadedByUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploadedByUser: User;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
