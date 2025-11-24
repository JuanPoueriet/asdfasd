import re

file_path = 'apps/webapp/src/app/app.routes.ts'

with open(file_path, 'r') as f:
    content = f.read()

# Replace core imports
content = content.replace("import { authGuard } from './core/guards/auth-guard';", "import { authGuard } from '@univeex/shared/core';")
content = content.replace("import { languageRedirectGuard } from './core/guards/language.guard';", "import { languageRedirectGuard } from '@univeex/shared/core';")

# Replace feature imports
replacements = {
    r"import\('./features/auth/auth.routes'\)": "import('@univeex/auth/feature-shell')",
    r"import\('./features/dashboard/dashboard.page'\)": "import('@univeex/dashboard/feature-shell')",
    r"import\('./features/my-work/my-work.page'\)": "import('@univeex/my-work/feature-shell')",
    r"import\('./features/approvals/approvals.page'\)": "import('@univeex/approvals/feature-shell')",
    r"import\('./features/notifications/notifications.page'\)": "import('@univeex/notifications/feature-shell')",
    r"import\('./features/global-search/global-search.page'\)": "import('@univeex/global-search/feature-shell')",
    r"import\('./features/data-imports/data-imports.page'\)": "import('@univeex/data-imports/feature-shell')",
    r"import\('./features/data-exports/data-exports.page'\)": "import('@univeex/data-exports/feature-shell')",
    r"import\('./features/masters/masters.routes'\)": "import('@univeex/masters/feature-shell')",
    r"import\('./features/documents/layout/documents.layout'\)": "import('@univeex/documents/feature-shell')",
    r"import\('./features/sales/sales.routes'\)": "import('@univeex/sales/feature-shell')",
    r"import\('./features/invoices/invoices.routes'\)": "import('@univeex/invoices/feature-shell')",
    r"import\('./features/inventory/inventory.routes'\)": "import('@univeex/inventory/feature-shell')",
    r"import\('./features/documents/documents.routes'\)": "import('@univeex/documents/feature-shell')",
    r"import\('./features/contacts/contacts.routes'\)": "import('@univeex/contacts/feature-shell')",
    r"import\('./features/accounting/accounting.routes'\)": "import('@univeex/accounting/feature-shell')",
    r"import\('./features/settings/settings.routes'\)": "import('@univeex/settings/feature-shell')",
    r"import\('./features/reports/reports.routes'\)": "import('@univeex/reports/feature-shell')",
    r"import\('./features/purchasing/purchasing.routes'\)": "import('@univeex/purchasing/feature-shell')",
    r"import\('./features/accounts-payable/accounts-payable.routes'\)": "import('@univeex/accounts-payable/feature-shell')",
    r"import\('./features/customer-receipts/customer-receipts.routes'\)": "import('@univeex/customer-receipts/feature-shell')",
    r"import\('./features/unauthorized/unauthorized.page'\)": "import('@univeex/unauthorized/feature-shell')",
}

for pattern, replacement in replacements.items():
    content = re.sub(pattern, replacement, content)

with open(file_path, 'w') as f:
    f.write(content)
