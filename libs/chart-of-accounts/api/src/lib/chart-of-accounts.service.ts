import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '@univeex/chart-of-accounts/domain';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class ChartOfAccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  create(createAccountDto: CreateAccountDto, organizationId: string): Promise<Account> {
    const account = this.accountRepository.create({
      ...createAccountDto,
      organizationId,
    });
    return this.accountRepository.save(account);
  }

  findAll(organizationId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { organizationId },
      order: { code: 'ASC' },
    });
  }

  async findOne(id: string, organizationId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, organizationId },
    });
    if (!account) {
      throw new NotFoundException(`Cuenta con ID "${id}" no encontrada.`);
    }
    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
    organizationId: string,
  ): Promise<Account> {
    const account = await this.findOne(id, organizationId);
    const updatedAccount = this.accountRepository.merge(
      account,
      updateAccountDto,
    );
    return this.accountRepository.save(updatedAccount);
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const account = await this.findOne(id, organizationId);
    await this.accountRepository.remove(account);
  }
}
