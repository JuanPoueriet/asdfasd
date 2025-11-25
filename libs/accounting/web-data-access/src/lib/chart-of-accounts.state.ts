import { Injectable, computed, signal, inject } from '@angular/core';
import { take } from 'rxjs/operators';
import { Account, FlattenedAccount, AccountType } from '@univeex/accounting/domain';
import { TreeService } from '@univeex/shared/util-common';
import { ChartOfAccountsApiService } from './chart-of-accounts.service';
import { NotificationService } from '@univeex/notifications/data-access';

type Sort = { field: keyof FlattenedAccount; direction: 'asc' | 'desc' };
type Filters = { status: 'ALL' | 'ACTIVE' | 'INACTIVE'; type: 'ALL' | AccountType; };

@Injectable({ providedIn: 'root' })
export class ChartOfAccountsStateService {
  private readonly apiService = inject(ChartOfAccountsApiService);
  private readonly treeService = inject(TreeService);
  private readonly notificationService = inject(NotificationService);

  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  private readonly allAccounts = signal<Account[]>([]);
  private readonly expandedAccountIds = signal<Set<string>>(new Set());
  
  readonly searchTerm = signal<string>('');
  readonly filters = signal<Filters>({ status: 'ALL', type: 'ALL' });
  readonly sort = signal<Sort>({ field: 'code', direction: 'asc' });

  readonly accountTree = computed(() => this.treeService.buildTree(this.allAccounts(), this.sort()));

  readonly flattenedAccounts = computed<FlattenedAccount[]>(() => {
    const tree = this.accountTree();
    const expandedIds = this.expandedAccountIds();
    const flatAccounts = this.treeService.flattenTree(tree);
    return flatAccounts.map(acc => ({
      ...acc,
      isExpanded: expandedIds.has(acc.id)
    }));
  });

  readonly displayAccounts = computed<FlattenedAccount[]>(() => {
    const accounts = this.flattenedAccounts();
    const expandedIds = this.expandedAccountIds();
    const term = this.searchTerm().toLowerCase();
    const currentFilters = this.filters();

    const filteredAccounts = accounts.filter(acc => {
      const statusMatch = currentFilters.status === 'ALL' || (currentFilters.status === 'ACTIVE' ? acc.isActive : !acc.isActive);
      const typeMatch = currentFilters.type === 'ALL' || acc.type === currentFilters.type;
      return statusMatch && typeMatch;
    });

    if (!term) {
      return filteredAccounts.filter(acc => acc.level === 0 || expandedIds.has(acc.parentId!));
    }

    return filteredAccounts.filter(acc => 
        Object.values(acc.name).some(name => name.toLowerCase().includes(term)) || 
        acc.code.toLowerCase().includes(term)
    );
  });

  readonly parentAccountOptions = computed(() =>
    this.allAccounts()
      .filter(a => !a.isPostable)
      .map(a => ({ id: a.id, name: a.name, code: a.code }))
  );

  public loadAccounts(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.apiService.getAccounts().pipe(take(1)).subscribe({
      next: (accounts) => {
        this.allAccounts.set(accounts);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Could not load chart of accounts.');
        this.isLoading.set(false);
      }
    });
  }

  public refreshAccounts(): void {
    this.loadAccounts();
  }

  public toggleAccountExpansion(accountId: string): void {
    this.expandedAccountIds.update(currentSet => {
      const newSet = new Set(currentSet);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  }

  public deleteAccount(accountId: string): void {
    this.apiService.deleteAccount(accountId).pipe(take(1)).subscribe({
        next: () => {
            this.notificationService.showSuccess('Account deleted successfully.');
            this.refreshAccounts();
        },
        error: () => this.notificationService.showError('Failed to delete account.')
    });
  }

  public setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  public setFilter(filter: keyof Filters, value: any): void {
    this.filters.update(current => ({ ...current, [filter]: value }));
  }

  public setSort(field: keyof FlattenedAccount): void {
    this.sort.update(current => {
      const direction = current.field === field && current.direction === 'asc' ? 'desc' : 'asc';
      return { field, direction };
    });
  }
}
