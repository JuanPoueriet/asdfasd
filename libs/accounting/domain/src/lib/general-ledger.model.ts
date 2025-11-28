export interface GeneralLedgerLine {
  id: string;
  date: string;
  reference: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

export interface GeneralLedger {
  initialBalance: number;
  finalBalance: number;
  lines: GeneralLedgerLine[];
  account: {
    id: string;
    code: string;
    name: string;
  };
}
