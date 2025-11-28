import { Injectable } from '@nestjs/common';
import { InvoicesService } from '@univeex/invoices/backend/feature';
import { InventoryService } from '@univeex/inventory/feature-api';
import { CustomersService } from '@univeex/customers/feature-api';

@Injectable()
export class SearchService {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly inventoryService: InventoryService,
    private readonly customersService: CustomersService,
  ) {}

  async search(query: string, organizationId: string) {
    const lowerCaseQuery = query.toLowerCase();

    const [allInvoices, allProducts, allCustomers] = await Promise.all([
      this.invoicesService.findAll(organizationId),
      this.inventoryService.findAll(organizationId),
      this.customersService.findAll(organizationId),
    ]);

    const invoices = allInvoices.filter(
      (i) =>
        i.invoiceNumber.toLowerCase().includes(lowerCaseQuery) ||
        // Check if customer exists and has name, or fall back to empty string
        (i.customer?.companyName || '').toLowerCase().includes(lowerCaseQuery),
    );

    const products = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerCaseQuery) ||
        p.sku?.toLowerCase().includes(lowerCaseQuery),
    );

    const customers = allCustomers.filter(
      (c) =>
        c.companyName.toLowerCase().includes(lowerCaseQuery) ||
        c.taxId?.toLowerCase().includes(lowerCaseQuery),
    );

    return [
      {
        type: 'Invoices',
        results: invoices.map((i) => ({
          id: i.id,
          title: `Factura #${i.invoiceNumber}`,
          description: `Cliente: ${i.customer?.companyName || 'Desconocido'}`,
          link: `/app/invoices/${i.id}`,
        })),
      },
      {
        type: 'Products',
        results: products.map((p) => ({
          id: p.id,
          title: p.name,
          description: `SKU: ${p.sku}`,
          link: `/app/inventory/products/${p.id}/edit`,
        })),
      },
      {
        type: 'Customers',
        results: customers.map((c) => ({
          id: c.id,
          title: c.companyName,
          description: `RNC: ${c.taxId}`,
          link: `/app/masters/customers/${c.id}/edit`,
        })),
      },
    ].filter((g) => g.results.length > 0);
  }
}
