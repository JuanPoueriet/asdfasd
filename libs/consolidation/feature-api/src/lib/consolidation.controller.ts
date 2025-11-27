
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { ConsolidationService } from './consolidation.service';
import { RunConsolidationDto } from './dto/run-consolidation.dto';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';
import { HasPermission } from '@univeex/auth/feature-api';
import { PERMISSIONS } from '@univeex/shared/util-common';

@Controller('consolidation')
@UseGuards(JwtAuthGuard)
export class ConsolidationController {
  constructor(private readonly consolidationService: ConsolidationService) {}

  @Post('run')
  @HasPermission(PERMISSIONS.FINANCIALS_CONSOLIDATE)
  runConsolidation(
    @Body() runDto: RunConsolidationDto,
    @CurrentUser() user: User,
  ) {
    const asOfDate = new Date(runDto.asOfDate);
    return this.consolidationService.runConsolidation(user.organizationId, asOfDate);
  }
}