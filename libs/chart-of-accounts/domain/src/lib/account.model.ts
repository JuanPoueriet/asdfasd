export interface Account {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: AccountType;
  isTaxAccount: boolean;
  isDefault: boolean;
  organizationId: string;
}

export enum AccountType {
  ASSET = 'Asset',
  LIABILITY = 'Liability',
  EQUITY = 'Equity',
  REVENUE = 'Revenue',
  EXPENSE = 'Expense',
}
