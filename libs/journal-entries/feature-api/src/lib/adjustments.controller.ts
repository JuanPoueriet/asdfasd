
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';
import { AdjustmentsService } from './adjustments.service';
import { CreateReclassificationEntryDto } from './dto/reclassification-entry.dto';
import { CreatePeriodEndAdjustmentDto } from './dto/period-end-adjustment.dto';
import { PeriodLockGuard } from '@univeex/accounting/api-feature-chart-of-accounts';
import { HasPermission } from '@univeex/auth/feature-api';
import { PERMISSIONS } from '@univeex/shared/util-common';

@Controller('journal-entries/adjustments')
@UseGuards(JwtAuthGuard, PeriodLockGuard)
export class AdjustmentsController {
  constructor(private readonly adjustmentsService: AdjustmentsService) {}

  @Post('reclassify')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  createReclassification(
    @Body() dto: CreateReclassificationEntryDto,
    @CurrentUser() user: User,
  ) {
    return this.adjustmentsService.createReclassification(
      dto,
      user.organizationId,
    );
  }

  @Post('period-end')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  createPeriodEndAdjustment(
    @Body() dto: CreatePeriodEndAdjustmentDto,
    @CurrentUser() user: User,
  ) {
    return this.adjustmentsService.createPeriodEndAdjustment(
      dto,
      user.organizationId,
    );
  }
}
