import { AccountType } from '@univeex/chart-of-accounts/domain';

export class CreateAccountDto {
  code: string;
  name: string;
  description?: string;
  type: AccountType;
  isTaxAccount: boolean;
  isDefault: boolean;
}
