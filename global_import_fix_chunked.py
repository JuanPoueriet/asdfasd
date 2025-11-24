import os
import re

mapping = {
    'src/auth': '@univeex/auth/feature-api',
    'src/users': '@univeex/users/feature-api',
    'src/accounting': '@univeex/accounting/feature-api',
    'src/taxes': '@univeex/taxes/feature-api',
    # ... Add others as needed, but let's start with these common ones
}

files_to_process = []
for root, dirs, files in os.walk("libs"):
    for file in files:
        if file.endswith(".ts"):
            files_to_process.append(os.path.join(root, file))

# Chunking
chunk_size = 100
for i in range(0, len(files_to_process), chunk_size):
    chunk = files_to_process[i:i + chunk_size]
    print(f"Processing chunk {i}...")

    for path in chunk:
        with open(path, 'r') as f:
            content = f.read()

        original_content = content

        # Apply all replacements
        # I need the full mapping here, otherwise I'll miss things.
        # But I can't redefine it every time.
        # I'll paste the full mapping again.
        full_mapping = {
            'src/auth': '@univeex/auth/feature-api',
            'src/users': '@univeex/users/feature-api',
            'src/accounting': '@univeex/accounting/feature-api',
            'src/taxes': '@univeex/taxes/feature-api',
            'src/sales': '@univeex/sales/feature-api',
            'src/inventory': '@univeex/inventory/feature-api',
            'src/dashboard': '@univeex/dashboard/feature-api',
            'src/customers': '@univeex/customers/feature-api',
            'src/suppliers': '@univeex/suppliers/feature-api',
            'src/organizations': '@univeex/organizations/feature-api',
            'src/roles': '@univeex/roles/feature-api',
            'src/reports': '@univeex/reports/feature-api',
            'src/reporting': '@univeex/reporting/feature-api',
            'src/invoices': '@univeex/invoices/feature-api',
            'src/intercompany': '@univeex/intercompany/feature-api',
            'src/units-of-measure': '@univeex/units-of-measure/feature-api',
            'src/notifications': '@univeex/notifications/feature-api',
            'src/currencies': '@univeex/currencies/feature-api',
            'src/webhooks': '@univeex/webhooks/feature-api',
            'src/database': '@univeex/database/feature-api',
            'src/assets': '@univeex/assets/feature-api',
            'src/compliance': '@univeex/compliance/feature-api',
            'src/localization': '@univeex/localization/feature-api',
            'src/queues': '@univeex/queues/feature-api',
            'src/bi': '@univeex/bi/feature-api',
            'src/mail': '@univeex/mail/feature-api',
            'src/cache': '@univeex/cache/feature-api',
            'src/budgets': '@univeex/budgets/feature-api',
            'src/core': '@univeex/core/feature-api',
            'src/push-notifications': '@univeex/push-notifications/feature-api',
            'src/chart-of-accounts': '@univeex/chart-of-accounts/feature-api',
            'src/price-lists': '@univeex/price-lists/feature-api',
            'src/workflows': '@univeex/workflows/feature-api',
            'src/storage': '@univeex/storage/feature-api',
            'src/financial-reporting': '@univeex/financial-reporting/feature-api',
            'src/dimensions': '@univeex/dimensions/feature-api',
            'src/treasury': '@univeex/treasury/feature-api',
            'src/accounts-payable': '@univeex/accounts-payable/feature-api',
            'src/consolidation': '@univeex/consolidation/feature-api',
            'src/analytical-reporting': '@univeex/analytical-reporting/feature-api',
            'src/customer-service': '@univeex/customer-service/feature-api',
            'src/health': '@univeex/health/feature-api',
            'src/reconciliation': '@univeex/reconciliation/feature-api',
            'src/fixed-assets': '@univeex/fixed-assets/feature-api',
            'src/batch-processes': '@univeex/batch-processes/feature-api',
            'src/cost-accounting': '@univeex/cost-accounting/feature-api',
            'src/journal-entries': '@univeex/journal-entries/feature-api',
            'src/search': '@univeex/search/feature-api',
            'src/websockets': '@univeex/websockets/feature-api',
            'src/audit': '@univeex/audit/feature-api',
            'src/my-work': '@univeex/my-work/feature-api',
        }

        for src, replacement in full_mapping.items():
            content = re.sub(f"from ['\"]{src}", f"from '{replacement}", content)
            content = re.sub(f"from ['\"]{src}/", f"from '{replacement}/", content)

        if content != original_content:
            with open(path, 'w') as f:
                f.write(content)
