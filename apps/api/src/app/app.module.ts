
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ScheduleModule } from '@nestjs/schedule';


import { CacheModule } from '@univeex/cache/feature-api';


import { AuthModule } from '@univeex/auth/feature-api';
import { UsersModule } from '@univeex/users/backend/feature';

import { JournalEntriesModule } from '@univeex/journal-entries/feature-api';
import { AccountingModule } from '@univeex/accounting/api-feature';
import { ConsolidationModule } from '@univeex/consolidation/feature-api';
import { OrganizationsModule } from '@univeex/organizations/feature-api';
// import { SharedModule } from './shared/shared.module'; // Removed or Moved
import { ChartOfAccountsModule } from '@univeex/chart-of-accounts/feature-api';
import { RolesModule } from '@univeex/roles/api-feature';
import { InvoicesModule } from '@univeex/invoices/backend/feature';
import { InventoryModule } from '@univeex/inventory/feature-api';
import { CustomersModule } from '@univeex/customers/feature-api';
import { SuppliersModule } from '@univeex/suppliers/api-feature';
import { PriceListsModule } from '@univeex/price-lists/feature-api';
import { CurrenciesModule } from '@univeex/currencies/feature-api';
import { TaxesModule } from '@univeex/taxes/backend/feature';
import { DashboardModule } from '@univeex/dashboard/feature-api';
import { ReconciliationModule } from '@univeex/reconciliation/feature-api';
import { AccountsPayableModule } from '@univeex/accounts-payable/feature-api';
import { FixedAssetsModule } from '@univeex/fixed-assets/feature-api';
import { BudgetsModule } from '@univeex/budgets/feature-api';
import { DimensionsModule } from '@univeex/dimensions/feature-api';
import { MailModule } from '@univeex/mail/feature-api';
import { WebsocketsModule } from '@univeex/websockets/feature-api';
import { AuditModule } from '@univeex/audit/feature-api';
import { ComplianceModule } from '@univeex/compliance/feature-api';
import { QueuesModule } from '@univeex/queues/feature-api';
import { HealthModule } from '@univeex/health/feature-api';
import { SearchModule } from '@univeex/search/feature-api';
import { MyWorkModule } from '@univeex/my-work/feature-api';
import { LocalizationModule } from '@univeex/localization/feature-api';
import { UnitsOfMeasureModule } from '@univeex/units-of-measure/api-feature'; // Fixed import
import { NotificationsModule } from '@univeex/notifications/api-feature'; // Fixed import
import { PushNotificationsModule } from '@univeex/push-notifications/feature-api';
import { BiModule } from '@univeex/bi/feature-api';


const envValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),

  RECAPTCHA_V3_SECRET_KEY: Joi.string().required(),


  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),

});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidation,
    }),


    CacheModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({

      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: config.get<boolean>('DB_SYNCHRONIZE', false),
        logging: config.get<boolean>('DB_LOGGING', false),
        ssl: config.get<boolean>('DB_SSL', false)
          ? { rejectUnauthorized: false }
          : false,
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    GoogleRecaptchaModule.forRoot({
      secretKey: process.env.RECAPTCHA_V3_SECRET_KEY,
      response: (req) => req.body.recaptchaToken,
      score: 0.7,
      skipIf: process.env.NODE_ENV !== 'production',
    }),


    AuthModule,
    UsersModule,
    OrganizationsModule,
    // SharedModule,
    ChartOfAccountsModule,
    RolesModule,
    InvoicesModule,
    InventoryModule,
    CustomersModule,
    SuppliersModule,
    PriceListsModule,
    CurrenciesModule,
    TaxesModule,
    JournalEntriesModule,
    DashboardModule,
    ReconciliationModule,
    AccountsPayableModule,
    FixedAssetsModule,
    BudgetsModule,
    DimensionsModule,
    MailModule,
    WebsocketsModule,
    AuditModule,
    ComplianceModule,
    AccountingModule,
    ConsolidationModule,
    QueuesModule,
    HealthModule, 
    SearchModule,
    MyWorkModule,
    LocalizationModule,
    UnitsOfMeasureModule,
    NotificationsModule,
    PushNotificationsModule,
    BiModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
