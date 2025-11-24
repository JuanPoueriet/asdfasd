import re

file_path = 'apps/api/src/app.module.ts'

with open(file_path, 'r') as f:
    content = f.read()

# Replace imports
replacements = {
    r"import { CacheModule } from './cache/cache.module';": "import { CacheModule } from '@univeex/cache/feature-api';",
    r"import { AuthModule } from './auth/auth.module';": "import { AuthModule } from '@univeex/auth/feature-api';",
    r"import { UsersModule } from './users/users.module';": "import { UsersModule } from '@univeex/users/feature-api';",
    r"import { JournalEntriesModule } from './journal-entries/journal-entries.module';": "import { JournalEntriesModule } from '@univeex/journal-entries/feature-api';",
    r"import { AccountingModule } from './accounting/accounting.module';": "import { AccountingModule } from '@univeex/accounting/feature-api';",
    r"import { ConsolidationModule } from './consolidation/consolidation.module';": "import { ConsolidationModule } from '@univeex/consolidation/feature-api';",
    r"import { OrganizationsModule } from './organizations/organizations.module';": "import { OrganizationsModule } from '@univeex/organizations/feature-api';",
    r"import { SharedModule } from './shared/shared.module';": "// import { SharedModule } from './shared/shared.module'; // Removed or Moved",
    r"import { ChartOfAccountsModule } from './chart-of-accounts/chart-of-accounts.module';": "import { ChartOfAccountsModule } from '@univeex/chart-of-accounts/feature-api';",
    r"import { RolesModule } from './roles/roles.module';": "import { RolesModule } from '@univeex/roles/feature-api';",
    r"import { InvoicesModule } from './invoices/invoices.module';": "import { InvoicesModule } from '@univeex/invoices/feature-api';",
    r"import { InventoryModule } from './inventory/inventory.module';": "import { InventoryModule } from '@univeex/inventory/feature-api';",
    r"import { CustomersModule } from './customers/customers.module';": "import { CustomersModule } from '@univeex/customers/feature-api';",
    r"import { SuppliersModule } from './suppliers/suppliers.module';": "import { SuppliersModule } from '@univeex/suppliers/feature-api';",
    r"import { PriceListsModule } from './price-lists/price-lists.module';": "import { PriceListsModule } from '@univeex/price-lists/feature-api';",
    r"import { CurrenciesModule } from './currencies/currencies.module';": "import { CurrenciesModule } from '@univeex/currencies/feature-api';",
    r"import { TaxesModule } from './taxes/taxes.module';": "import { TaxesModule } from '@univeex/taxes/feature-api';",
    r"import { DashboardModule } from './dashboard/dashboard.module';": "import { DashboardModule } from '@univeex/dashboard/feature-api';",
    r"import { ReconciliationModule } from './reconciliation/reconciliation.module';": "import { ReconciliationModule } from '@univeex/reconciliation/feature-api';",
    r"import { AccountsPayableModule } from './accounts-payable/accounts-payable.module';": "import { AccountsPayableModule } from '@univeex/accounts-payable/feature-api';",
    r"import { FixedAssetsModule } from './fixed-assets/fixed-assets.module';": "import { FixedAssetsModule } from '@univeex/fixed-assets/feature-api';",
    r"import { BudgetsModule } from './budgets/budgets.module';": "import { BudgetsModule } from '@univeex/budgets/feature-api';",
    r"import { DimensionsModule } from './dimensions/dimensions.module';": "import { DimensionsModule } from '@univeex/dimensions/feature-api';",
    r"import { MailModule } from './mail/mail.module';": "import { MailModule } from '@univeex/mail/feature-api';",
    r"import { WebsocketsModule } from './websockets/websockets.module';": "import { WebsocketsModule } from '@univeex/websockets/feature-api';",
    r"import { AuditModule } from './audit/audit.module';": "import { AuditModule } from '@univeex/audit/feature-api';",
    r"import { ComplianceModule } from './compliance/compliance.module';": "import { ComplianceModule } from '@univeex/compliance/feature-api';",
    r"import { QueuesModule } from './queues/queues.module';": "import { QueuesModule } from '@univeex/queues/feature-api';",
    r"import { HealthModule } from './health/health.module';": "import { HealthModule } from '@univeex/health/feature-api';",
    r"import { SearchModule } from './search/search.module';": "import { SearchModule } from '@univeex/search/feature-api';",
    r"import { MyWorkModule } from './my-work/my-work.module';": "import { MyWorkModule } from '@univeex/my-work/feature-api';",
    r"import { LocalizationModule } from './localization/localization.module';": "import { LocalizationModule } from '@univeex/localization/feature-api';",
    r"import { UnitsOfMeasureModule } from './units-of-measure/units-of-measure.module';": "import { UnitsOfMeasureModule } from '@univeex/units-of-measure/feature-api';",
    r"import { NotificationsModule } from './notifications/notifications.module';": "import { NotificationsModule } from '@univeex/notifications/feature-api';",
    r"import { PushNotificationsModule } from './push-notifications/push-notifications.module';": "import { PushNotificationsModule } from '@univeex/push-notifications/feature-api';",
    r"import { BiModule } from './bi/bi.module';": "import { BiModule } from '@univeex/bi/feature-api';",
}

for pattern, replacement in replacements.items():
    content = content.replace(pattern, replacement)

# SharedModule is special because I probably deleted it or moved it differently.
# I'll comment it out in the imports array too if I can find it.
# Actually I replaced the import line with a comment, but it is still in the @Module imports array.
# NestJS will complain if SharedModule is not defined.
# I should remove it from the imports array.

content = content.replace("    SharedModule,", "    // SharedModule,")

with open(file_path, 'w') as f:
    f.write(content)
