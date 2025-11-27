
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';
import { AccountSegmentsService } from './account-segments.service';
import { ConfigureAccountSegmentsDto } from './dto/account-segment-definition.dto';

@Controller('chart-of-accounts/segment-definitions')
@UseGuards(JwtAuthGuard)
export class AccountSegmentsController {
  constructor(private readonly segmentsService: AccountSegmentsService) {}

  @Get()
  getDefinitions(@CurrentUser() user: User) {
    return this.segmentsService.findByOrg(user.organizationId);
  }

  @Post()
  configureSegments(@Body() dto: ConfigureAccountSegmentsDto, @CurrentUser() user: User) {
    return this.segmentsService.configure(dto, user.organizationId);
  }
}