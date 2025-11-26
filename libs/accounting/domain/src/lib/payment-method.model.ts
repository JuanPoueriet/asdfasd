export interface PaymentMethod {
  type: 'credit_card' | 'paypal';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}
