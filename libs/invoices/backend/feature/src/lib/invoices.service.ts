import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm'; // Import DeepPartial
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  create(createInvoiceDto: CreateInvoiceDto, organizationId: string): Promise<Invoice> {
    // We need to map the DTO to the Entity structure manually or use type assertion
    // because properties like 'date' in DTO might map to 'issueDate' in Entity,
    // and 'status' string from DTO might need casting to Enum.

    // Assuming CreateInvoiceDto has fields compatible with Invoice, but maybe some need mapping.
    // The logs showed:
    // Argument of type '{ organizationId: string; invoiceNumber: string; customerName: string; date: string; dueDate: string; total: number; status: string; }' is not assignable to parameter of type 'DeepPartial<Invoice>'.
    // Types of property 'status' are incompatible. Type 'string' is not assignable to type 'DeepPartial<InvoiceStatus>'.

    // We need to handle the status conversion if it comes as string.

    const { status, date, ...rest } = createInvoiceDto as any; // Temporary assertion to handle unknown DTO shape

    const invoiceData: DeepPartial<Invoice> = {
        ...rest,
        organizationId,
        status: status as InvoiceStatus, // Cast string to Enum
        issueDate: date, // Map date to issueDate if that's the discrepancy
    };

    const invoice = this.invoiceRepository.create(invoiceData);
    return this.invoiceRepository.save(invoice);
  }

  findAll(organizationId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { organizationId },
      order: { issueDate: 'DESC' }, // Changed from 'date' to 'issueDate' based on entity definition
    });
  }

  async findOne(id: string, organizationId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, organizationId },
    });
    if (!invoice) {
      throw new NotFoundException(`Factura con ID "${id}" no encontrada.`);
    }
    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    organizationId: string,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, organizationId);

    // Handle status mapping for update as well
    const { status, date, ...rest } = updateInvoiceDto as any;

    const updateData: DeepPartial<Invoice> = {
        ...rest,
    };

    if (status) {
        updateData.status = status as InvoiceStatus;
    }
    if (date) {
        updateData.issueDate = date;
    }

    const updatedInvoice = this.invoiceRepository.merge(
      invoice,
      updateData,
    );
    return this.invoiceRepository.save(updatedInvoice);
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const invoice = await this.findOne(id, organizationId);
    await this.invoiceRepository.remove(invoice);
  }
}
