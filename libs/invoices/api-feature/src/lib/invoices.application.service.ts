import { Injectable } from '@nestjs/common';
import { InvoicesService } from '@univeex/invoices/backend/data-access';

@Injectable()
export class InvoicesApplicationService {
    constructor(private readonly invoicesService: InvoicesService) {}
}
