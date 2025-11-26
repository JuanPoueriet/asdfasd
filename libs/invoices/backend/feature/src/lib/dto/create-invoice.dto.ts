export class CreateInvoiceDto {
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  total: number;
  status: string;
}
