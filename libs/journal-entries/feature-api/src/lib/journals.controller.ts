
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
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';

@Controller('journals')
@UseGuards(JwtAuthGuard)
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Post()
  create(@Body() createJournalDto: CreateJournalDto, @CurrentUser() user: User) {
    return this.journalsService.create(createJournalDto, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.journalsService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.journalsService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJournalDto: UpdateJournalDto,
    @CurrentUser() user: User,
  ) {
    return this.journalsService.update(id, updateJournalDto, user.organizationId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.journalsService.remove(id, user.organizationId);
  }
}
