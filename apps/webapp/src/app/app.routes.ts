import { Routes } from '@angular/router';
import { authGuard } from '@univeex/shared/core';
import { MainLayout } from './layout/main/main.layout';
import { languageRedirectGuard } from '@univeex/shared/core';

export const APP_ROUTES: Routes = [
  {
    path: ':lang',
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('@univeex/auth/feature-shell').then((m) => m.AUTH_ROUTES),
      },
      {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('@univeex/dashboard/feature-shell').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'my-work',
        title: 'My Work',
        loadComponent: () =>
          import('@univeex/my-work/feature-shell').then((m) => m.MyWorkPage),
      },
      {
        path: 'approvals',
        title: 'Approvals',
        loadComponent: () =>
          import('@univeex/approvals/feature-shell').then(
            (m) => m.ApprovalsPage
          ),
      },
      {
        path: 'notifications',
        title: 'Notifications',
        loadComponent: () =>
          import('@univeex/notifications/feature-shell').then(
            (m) => m.NotificationsPage
          ),
      },
      {
        path: 'global-search',
        title: 'Búsqueda',
        loadComponent: () =>
          import('@univeex/global-search/feature-shell').then(
            (m) => m.GlobalSearchPage
          ),
      },
      {
        path: 'data-imports',
        title: 'Data Imports',
        loadComponent: () =>
          import('@univeex/data-imports/feature-shell').then(
            (m) => m.DataImportsPage
          ),
      },
      {
        path: 'data-exports',
        title: 'Data Exports',
        loadComponent: () =>
          import('@univeex/data-exports/feature-shell').then(
            (m) => m.DataExportsPage
          ),
      },
      {
        path: 'masters',
        title: 'Master Data',
        loadChildren: () =>
          import('@univeex/masters/feature-shell').then(
            (m) => m.MASTERS_ROUTES
          ),
      },
      {
        path: 'documents',
        title: 'Documents',
        loadComponent: () =>
          import('@univeex/documents/feature-shell').then(
            (m) => m.DocumentsLayout
          ),
      },
      {
        path: 'sales',
        title: 'Ventas',
        loadChildren: () =>
          import('@univeex/sales/feature-shell').then((m) => m.SALES_ROUTES),
      },
      {
        path: 'invoices',
        title: 'Facturas',
        loadChildren: () =>
          import('@univeex/invoices/feature-shell').then(
            (m) => m.INVOICES_ROUTES
          ),
      },
      {
        path: 'inventory',
        title: 'Inventario',
        loadChildren: () =>
          import('@univeex/inventory/feature-shell').then(
            (m) => m.INVENTORY_ROUTES
          ),
      },
      {
        path: 'documents',
        loadChildren: () =>
          import('@univeex/documents/feature-shell').then(
            (m) => m.DOCUMENTS_ROUTES
          ),
      },
      {
        path: 'contacts',
        title: 'Contactos',
        loadChildren: () =>
          import('@univeex/contacts/feature-shell').then(
            (m) => m.CONTACTS_ROUTES
          ),
      },
      {
        path: 'accounting',
        title: 'Accounting',
        loadChildren: () =>
          import('@univeex/accounting/feature-shell').then(
            (m) => m.ACCOUNTING_ROUTES
          ),
      },
      {
        path: 'settings',
        title: 'Configuración',
        loadChildren: () =>
          import('@univeex/settings/feature-shell').then(
            (m) => m.SETTINGS_ROUTES
          ),
      },
      {
        path: 'reports',
        title: 'Reports',
        loadChildren: () =>
          import('@univeex/reports/feature-shell').then(
            (m) => m.REPORTS_ROUTES
          ),
      },
      {
        path: 'purchasing',
        title: 'Purchasing',
        loadChildren: () =>
          import('@univeex/purchasing/feature-shell').then(
            (m) => m.PURCHASING_ROUTES
          ),
      },
      {
        path: 'accounts-payable',
        title: 'Cuentas por Pagar',
        loadChildren: () =>
          import('@univeex/accounts-payable/feature-shell').then(
            (m) => m.ACCOUNTS_PAYABLE_ROUTES
          ),
      },
      {
        path: 'customer-receipts',
        title: 'Recibos de Cliente',
        loadChildren: () =>
          import('@univeex/customer-receipts/feature-shell').then(
            (m) => m.CUSTOMER_RECEIPTS_ROUTES
          ),
      },
      {
        path: 'unauthorized',
        title: 'Acceso Denegado',
        loadComponent: () =>
          import('@univeex/unauthorized/feature-shell').then(
            (m) => m.UnauthorizedPage
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    canActivate: [languageRedirectGuard],
    component: MainLayout,
  },
];
