import { AccountType } from '@univeex/chart-of-accounts/domain';

export class UpdateAccountDto {
  code?: string;
  name?: string;
  description?: string;
  type?: AccountType;
  isTaxAccount?: boolean;
  isDefault?: boolean;
}
