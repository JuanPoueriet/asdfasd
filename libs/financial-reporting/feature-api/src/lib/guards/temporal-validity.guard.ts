
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Account } from '@univeex/chart-of-accounts/feature-api';

@Injectable()
export class TemporalValidityGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // Check if the request involves accounts (e.g. creating a journal entry)
    if (body.lines && Array.isArray(body.lines)) {
        const accountIds = body.lines.map((l: any) => l.accountId).filter((id: string) => !!id);
        if (accountIds.length > 0) {
            const date = body.date ? new Date(body.date) : new Date();
            await this.validateAccounts(accountIds, date);
        }
    }

    return true;
  }

  private async validateAccounts(accountIds: string[], date: Date): Promise<void> {
      const accounts = await this.dataSource.getRepository(Account).findByIds(accountIds);

      for (const account of accounts) {
          if (account.effectiveFrom && new Date(account.effectiveFrom) > date) {
              throw new ForbiddenException(`La cuenta ${account.code} no es válida antes de ${account.effectiveFrom}.`);
          }
          if (account.effectiveTo && new Date(account.effectiveTo) < date) {
              throw new ForbiddenException(`La cuenta ${account.code} ha expirado el ${account.effectiveTo}.`);
          }
      }
  }
}
