import { JournalEntryLine } from './journal-entry-line.model';

export interface CreateJournalEntryDto {
  date: string;
  description: string;
  journalId: string;
  lines: JournalEntryLine[];
}
