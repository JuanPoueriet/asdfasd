export interface Subscription {
  planId: 'trial' | 'pro' | 'enterprise';
  planName: string;
  status: 'active' | 'inactive' | 'past_due';
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  features: string[];
}
