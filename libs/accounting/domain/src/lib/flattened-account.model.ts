import { Account, AccountCategory } from './account.model';

export interface FlattenedAccount extends Account {
  level: number;
  parentId: string | null;
  isExpanded?: boolean;
  isDisabled?: boolean;
  hasChildren?: boolean;

  name: Record<string, string>;
  category: AccountCategory;
  isPostable: boolean;
  currency?: string;
  balance: number;
}
