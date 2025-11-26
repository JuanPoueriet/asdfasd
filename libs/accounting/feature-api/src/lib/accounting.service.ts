import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ledger } from '@univeex/accounting/domain';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(Ledger)
    private readonly ledgerRepository: Repository<Ledger>,
  ) {}

  findAllLedgers(organizationId: string): Promise<Ledger[]> {
    return this.ledgerRepository.find({
      where: { organizationId },
      order: { name: 'ASC' },
    });
  }
}
