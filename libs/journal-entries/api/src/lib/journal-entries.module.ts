import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntriesController } from './journal-entries.controller';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntry, JournalEntryLine } from '@univeex/journal-entries/domain';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry, JournalEntryLine])],
  controllers: [JournalEntriesController],
  providers: [JournalEntriesService],
  exports: [JournalEntriesService],
})
export class JournalEntriesModule {}
