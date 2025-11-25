import { Component, inject, signal } from '@angular/core';
// import { JournalsService } from '@univeex/accounting/data-access';
// import { Journal } from '@univeex/accounting/domain';
import { RouterLink } from '@angular/router';
import { JournalsService } from '@univeex/accounting/data-access';
import { Journal } from '@univeex/accounting/domain';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './journal-list.page.html',
  styleUrls: ['./journal-list.page.scss']
})
export class JournalListPage {
  private journalsService = inject(JournalsService);

  journals = signal<Journal[]>([]);

  ngOnInit() {
    this.journalsService.getJournals().subscribe(journals => {
      this.journals.set(journals);
    });
  }
}