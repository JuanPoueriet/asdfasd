import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  create(createInvoiceDto: CreateInvoiceDto, organizationId: string): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      organizationId,
    });
    return this.invoiceRepository.save(invoice);
  }

  findAll(organizationId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { organizationId },
      order: { date: 'DESC' },
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
    const updatedInvoice = this.invoiceRepository.merge(
      invoice,
      updateInvoiceDto,
    );
    return this.invoiceRepository.save(updatedInvoice);
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const invoice = await this.findOne(id, organizationId);
    await this.invoiceRepository.remove(invoice);
  }
}
