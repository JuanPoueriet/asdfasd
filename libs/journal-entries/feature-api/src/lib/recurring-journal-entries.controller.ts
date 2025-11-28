
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';
import { RecurringJournalEntriesService } from './recurring-journal-entries.service';
import {
  CreateRecurringJournalEntryDto,
  UpdateRecurringJournalEntryDto,
} from './dto/recurring-and-templates.dto';
import { PermissionsGuard } from '@univeex/auth/feature-api';
import { HasPermission } from '@univeex/auth/feature-api';
import { PERMISSIONS } from '@univeex/shared/util-common';

@Controller('journal-entries/recurring')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RecurringJournalEntriesController {
  constructor(
    private readonly recurringService: RecurringJournalEntriesService,
  ) {}

  @Post()
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  create(
    @Body() createDto: CreateRecurringJournalEntryDto,
    @CurrentUser() user: User,
  ) {
    return this.recurringService.create(createDto, user.organizationId);
  }

  @Get()
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW)
  findAll(@CurrentUser() user: User) {
    return this.recurringService.findAll(user.organizationId);
  }

  @Get(':id')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW)
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.recurringService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_EDIT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRecurringJournalEntryDto,
    @CurrentUser() user: User,
  ) {
    return this.recurringService.update(id, updateDto, user.organizationId);
  }

  @Delete(':id')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_EDIT)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.recurringService.remove(id, user.organizationId);
  }
}
