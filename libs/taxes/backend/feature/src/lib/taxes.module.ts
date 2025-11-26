import { Module } from '@nestjs/common';
import { TaxesController } from './taxes.controller';
import { TaxesFeatureApiModule } from '@univeex/taxes/feature-api';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TaxesFeatureApiModule,
    AuthModule,
    UsersModule
  ],
  controllers: [TaxesController],
})
export class TaxesModule {}
