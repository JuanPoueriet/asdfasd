export interface Ledger {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
