import { Injectable } from '@angular/core';
import { Account, FlattenedAccount } from '@univeex/accounting/domain';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor() { }

  public buildTree(accounts: Account[], sort: { field: keyof FlattenedAccount; direction: 'asc' | 'desc' }): Account[] {
    if (!Array.isArray(accounts) || accounts.length === 0) {
      return [];
    }
  
    const accountMap = new Map<string, Account>();
    accounts.forEach(account => {
      account.children = [];
      accountMap.set(account.id, account);
    });
  
    const rootAccounts: Account[] = [];
    accounts.forEach(account => {
      if (account.parentId && accountMap.has(account.parentId)) {
        accountMap.get(account.parentId)!.children!.push(account);
      } else {
        rootAccounts.push(account);
      }
    });
  
    const sortTree = (nodeList: Account[]): void => {
      nodeList.sort((a, b) => this.compareAccounts(a, b, sort));
      nodeList.forEach(node => {
        if (node.children && node.children.length > 0) {
          sortTree(node.children);
        }
      });
    };
  
    sortTree(rootAccounts);
  
    return rootAccounts;
  }

  private compareAccounts(a: Account, b: Account, sort: { field: keyof FlattenedAccount; direction: 'asc' | 'desc' }): number {
    const field = sort.field as keyof Account;
    const valA = a[field];
    const valB = b[field];

    let comparison = 0;
    if (valA != null && valB != null) {
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
    } else if (valA != null) {
      comparison = 1;
    } else if (valB != null) {
      comparison = -1;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  }

  public flattenTree(tree: Account[]): FlattenedAccount[] {
    const flattened: FlattenedAccount[] = [];

    const flatten = (nodes: Account[], level: number) => {
      for (const node of nodes) {
        flattened.push({
          ...node,
          level: level,
          isExpanded: false,
          hasChildren: !!node.children && node.children.length > 0
        });

        if (node.children && node.children.length > 0) {
          flatten(node.children, level + 1);
        }
      }
    };

    flatten(tree, 0);
    return flattened;
  }
}
