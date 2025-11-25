import { Routes } from '@angular/router';
import { AccountingLayout } from './layout/accounting.layout';

export const ACCOUNTING_ROUTES: Routes = [
  {
    path: '',
    component: AccountingLayout,
    children: [
      {
        path: 'chart-of-accounts',
        title: 'Chart of Accounts',
        loadChildren: () =>
          import('@univeex/accounting/feature-chart-of-accounts').then(
            (m) => m.CHART_OF_ACCOUNTS_ROUTES
          ),
      },
      {
        path: 'ledgers',
        loadChildren: () =>
          import('@univeex/accounting/feature-ledger-list').then(
            (m) => m.LEDGER_LIST_ROUTES
          ),
        title: 'Libros Contables',
      },
      {
        path: 'journals', // <- NUEVA RUTA
        title: 'Journals',
        loadChildren: () =>
          import('@univeex/accounting/feature-journal-list').then(
            (m) => m.JOURNAL_LIST_ROUTES
          ),
      },
      {
        path: 'journals/new', // <- NUEVA RUTA
        title: 'New Journal',
        loadChildren: () =>
          import('@univeex/accounting/feature-journal-form').then(
            (m) => m.JOURNAL_FORM_ROUTES
          ),
      },
      {
        path: 'general-ledger/new', // Nueva ruta
        title: 'New General Ledger',
        loadChildren: () =>
          import('@univeex/accounting/feature-ledger-form').then(
            (m) => m.LEDGER_FORM_ROUTES
          ),
      },
      {
        path: 'journal-entries',
        title: 'Journal Entries',
        loadChildren: () =>
          import('@univeex/accounting/feature-journal-entries').then(
            (m) => m.JOURNAL_ENTRIES_ROUTES
          ),
      },
      {
        path: 'daily-journal',
        title: 'Daily Journal',
        loadChildren: () =>
          import('@univeex/accounting/feature-daily-journal').then(
            (m) => m.DAILY_JOURNAL_ROUTES
          ),
      },
      {
        path: 'general-ledger',
        title: 'General Ledger',
        loadChildren: () =>
          import('@univeex/accounting/feature-general-ledger').then(
            (m) => m.GENERAL_LEDGER_ROUTES
          ),
      },
      {
        path: 'periods',
        title: 'Accounting Periods',
        loadChildren: () =>
          import('@univeex/accounting/feature-periods').then(
            (m) => m.PERIODS_ROUTES
          ),
      },
      {
        path: 'closing',
        loadChildren: () =>
          import('@univeex/accounting/feature-closing').then((m) => m.CLOSING_ROUTES),
      },
      {
        path: 'reconciliation',
        title: 'Account Reconciliation',
        loadChildren: () =>
          import('@univeex/accounting/feature-reconciliation').then(
            (m) => m.RECONCILIATION_ROUTES
          ),
      },
      {
        path: 'subsidiary-ledgers',
        title: 'Subsidiary Ledgers',
        loadComponent: () =>
          import('./subsidiary-ledgers/subsidiary-ledgers.page').then(
            (m) => m.SubsidiaryLedgersPage
          ),
      },
      {
        path: 'variance-analysis',
        title: 'Variance Analysis',
        loadComponent: () =>
          import('./variance-analysis/variance-analysis.page').then(
            (m) => m.VarianceAnalysisPage
          ),
      },
      {
        path: 'chart-of-accounts/new',
        title: 'New Account',
        loadComponent: () =>
          import('@univeex/accounting/feature-account-form').then(
            (m) => m.AccountFormPage
          ),
      },
      {
        path: 'approvals',
        title: 'Approvals',
        loadComponent: () =>
          import('@univeex/accounting/feature-approvals').then(
            (m) => m.Approvals
          ),
      },
      {
        path: 'chart-of-accounts/:id/edit',
        title: 'Edit Account',
        loadComponent: () =>
          import('@univeex/accounting/feature-account-form').then(
            (m) => m.AccountFormPage
          ),
      },
      {
        path: 'journal-entries/new', // <- NUEVA RUTA
        title: 'New Journal Entry',
        loadChildren: () =>
          import('@univeex/accounting/feature-journal-entry-form').then(
            (m) => m.JOURNAL_ENTRY_FORM_ROUTES
          ),
      },
      {
        path: 'journal-entries/import',
        title: 'Import Journal Entries',
        loadComponent: () =>
          import('./journal-entries/import/import.page').then(
            (m) => m.JournalEntryImportPage
          ),
      },
      {
        path: 'journal-entries/:id/edit', // <- NUEVA RUTA
        title: 'Edit Journal Entry',
        loadComponent: () =>
          import('./journal-entry-form/journal-entry-form.page').then(
            (m) => m.JournalEntryFormPage
          ),
      },

      {
        path: 'general-ledger/:accountId',
        loadComponent: () =>
          import('./general-ledger/general-ledger.page').then(
            (m) => m.GeneralLedgerPage
          ),
      },

      {
        path: '',
        redirectTo: 'chart-of-accounts',
        pathMatch: 'full',
      },
    ],
  },
];
