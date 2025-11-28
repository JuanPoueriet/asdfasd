
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
import { JournalEntryTemplatesService } from './journal-entry-templates.service';
import { CreateJournalEntryTemplateDto, UpdateJournalEntryTemplateDto, CreateJournalEntryFromTemplateDto } from './dto/recurring-and-templates.dto';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';
import { PermissionsGuard } from '@univeex/auth/feature-api';
import { HasPermission } from '@univeex/auth/feature-api';
import { PERMISSIONS } from '@univeex/shared/util-common';

@Controller('journal-entries/templates')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JournalEntryTemplatesController {
  constructor(private readonly templatesService: JournalEntryTemplatesService) {}

  @Post()
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  create(@Body() createDto: CreateJournalEntryTemplateDto, @CurrentUser() user: User) {
    return this.templatesService.create(createDto, user.organizationId);
  }

  @Get()
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW)
  findAll(@CurrentUser() user: User) {
    return this.templatesService.findAll(user.organizationId);
  }

  @Get(':id')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW)
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.templatesService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_EDIT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateJournalEntryTemplateDto,
    @CurrentUser() user: User,
  ) {
    return this.templatesService.update(id, updateDto, user.organizationId);
  }

  @Delete(':id')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_EDIT)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.templatesService.remove(id, user.organizationId);
  }

  @Post(':id/generate')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  generateEntry(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateJournalEntryFromTemplateDto,
    @CurrentUser() user: User,
  ) {
    return this.templatesService.createEntryFromTemplate(id, dto, user.organizationId);
  }
}
