import { JournalEntryLine } from './journal-entry-line.model';

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  status: string;
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
