
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedAssetsService } from './fixed-assets.service';
import { FixedAssetsController } from './fixed-assets.controller';
import { FixedAsset } from './entities/fixed-asset.entity';
import { JournalEntriesModule } from '@univeex/journal-entries/feature-api';
import { AuthModule } from '@univeex/auth/feature-api';
import { DepreciationService } from './depreciation.service';
import { OrganizationSettings } from '@univeex/organizations/feature-api';
import { Journal } from '@univeex/journal-entries/feature-api';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FixedAsset,
      OrganizationSettings,
      Journal,
    ]),
    forwardRef(() => JournalEntriesModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [FixedAssetsController],
  providers: [FixedAssetsService, DepreciationService],
  exports: [DepreciationService],
})
export class FixedAssetsModule {}