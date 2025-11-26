export interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  description: string;
  invoiceUrl: string;
}
