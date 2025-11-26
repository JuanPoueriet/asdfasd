export interface JournalEntryLine {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  description: string;
  isReconciled: boolean;
}
