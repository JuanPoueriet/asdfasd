
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntercompanyTransaction } from './entities/intercompany-transaction.entity';
import { IntercompanyService } from './intercompany.service';
import { IntercompanyController } from './intercompany.controller';
import { JournalEntriesModule } from 'src/journal-entries/journal-entries.module';
import { AuthModule } from '@univeex/auth/feature-api';
import { Organization } from '@univeex/organizations/feature-api';
import { OrganizationSettings } from 'src/organizations/entities/organization-settings.entity';
import { ExchangeRate } from 'src/currencies/entities/exchange-rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IntercompanyTransaction,
      Organization,
      OrganizationSettings,
      ExchangeRate,
    ]),
    JournalEntriesModule,
    AuthModule,
  ],
  providers: [IntercompanyService],
  controllers: [IntercompanyController],
})
export class IntercompanyModule {}