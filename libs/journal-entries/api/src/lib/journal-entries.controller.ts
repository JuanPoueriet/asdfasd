import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from '@univeex/journal-entries/domain';
import { JwtAuthGuard, GetUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/domain';

@Controller('journal-entries')
@UseGuards(JwtAuthGuard)
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Post()
  create(@Body() createJournalEntryDto: CreateJournalEntryDto, @GetUser() user: User) {
    return this.journalEntriesService.create(createJournalEntryDto, user.organizationId);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.journalEntriesService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.journalEntriesService.findOne(id, user.organizationId);
  }
}
