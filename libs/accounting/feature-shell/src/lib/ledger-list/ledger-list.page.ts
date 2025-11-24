import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { LucideAngularModule, PlusCircle } from 'lucide-angular';
import { LedgersService,  } from '@univeex/accounting/data-access';
import { Ledger } from '@univeex/accounting/domain';

@Component({
  selector: 'app-ledger-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './ledger-list.page.html',
  styleUrls: ['./ledger-list.page.scss'],
})
export class LedgerListPage {
  private ledgersService = inject(LedgersService);

  ledgers$: Observable<Ledger[]> = this.ledgersService.getLedgers();
  
  protected readonly CreateIcon = PlusCircle;
}