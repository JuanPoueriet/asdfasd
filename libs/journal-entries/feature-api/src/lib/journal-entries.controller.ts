
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';
import { PermissionsGuard } from '@univeex/auth/feature-api';
import { HasPermission } from '@univeex/auth/feature-api';
import { PERMISSIONS } from '@univeex/shared/util-common';
import { PeriodLockGuard } from '@univeex/accounting/api-feature-chart-of-accounts';
import {
  UpdateJournalEntryDto,
  ReverseJournalEntryDto,
} from './dto/journal-entry-actions.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JournalEntryImportService } from './journal-entry-import.service';
import { ConfirmImportDto, PreviewImportRequestDto } from './dto/journal-entry-import.dto';
import { TemporalValidityGuard } from '@univeex/financial-reporting/feature-api';

@Controller('journal-entries')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JournalEntriesController {
  constructor(
    private readonly journalEntriesService: JournalEntriesService,
    private readonly journalEntryImportService: JournalEntryImportService,
  ) {}

  @Post()
  @UseGuards(PeriodLockGuard, TemporalValidityGuard)
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  create(
    @Body() createJournalEntryDto: CreateJournalEntryDto,
    @CurrentUser() user: User,
  ) {
    return this.journalEntriesService.create(
      createJournalEntryDto,
      user.organizationId,
    );
  }

  @Get()
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW)
  findAll(@CurrentUser() user: User) {
    return this.journalEntriesService.findAll(user.organizationId);
  }

  @Get(':id')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW)
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.journalEntriesService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  @UseGuards(PeriodLockGuard, TemporalValidityGuard)
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_EDIT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJournalEntryDto: UpdateJournalEntryDto,
    @CurrentUser() user: User,
  ) {
    return this.journalEntriesService.update(
      id,
      user.organizationId,
      updateJournalEntryDto,
    );
  }

  @Post(':id/reverse')
  @UseGuards(PeriodLockGuard, TemporalValidityGuard)
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  reverse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() reverseDto: ReverseJournalEntryDto,
    @CurrentUser() user: User,
  ) {
    return this.journalEntriesService.reverse(
      id,
      user.organizationId,
      reverseDto,
    );
  }

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_EDIT)
  addAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.journalEntriesService.addAttachment(
      id,
      file,
      user.organizationId,
      user.id,
    );
  }

  @Get('attachments/:attachmentId')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW)
  async getAttachment(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const { streamable, metadata } =
      await this.journalEntriesService.getAttachment(
        attachmentId,
        user.organizationId,
      );

    res.set({
      'Content-Type': streamable.mimeType,
      'Content-Length': streamable.fileSize,
      'Content-Disposition': `inline; filename="${metadata.fileName}"`,
    });

    streamable.stream.pipe(res);
  }

  @Delete('attachments/:attachmentId')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_EDIT)
  deleteAttachment(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.journalEntriesService.deleteAttachment(
      attachmentId,
      user.organizationId,
    );
  }

  @Post(':id/submit-approval')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  submitForApproval(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.journalEntriesService.submitForApproval(
      id,
      user.organizationId,
    );
  }

  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  previewImport(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.journalEntryImportService.previewImport(
      file,
      user.organizationId,
    );
  }

  @Post('import/confirm/:batchId')
  @HasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE)
  confirmImport(
    @Param('batchId') batchId: string,
    @CurrentUser() user: User,
  ) {
    return this.journalEntryImportService.confirmImport(
      batchId,
      user.organizationId,
      user.id
    );
  }
}
