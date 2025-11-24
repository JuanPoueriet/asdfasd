import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
import { GeneralLedger, Ledger } from '@univeex/accounting/domain';

export type CreateLedgerDto = Partial<Ledger>;
export type UpdateLedgerDto = Partial<Ledger>;

@Injectable({
  providedIn: 'root'
})
export class LedgersService {
  private http = inject(HttpClient);
  private apiUrl = `/api/accounting/ledgers`;

  getGeneralLedger(accountId: string, startDate: string, endDate: string): Observable<GeneralLedger> {
    const params = new HttpParams()
      .set('accountId', accountId)
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<GeneralLedger>(`${this.apiUrl}/general-ledger`, { params });
  }

  getLedgers(): Observable<Ledger[]> {
    return this.http.get<Ledger[]>(this.apiUrl);
  }

  getLedger(id: string): Observable<Ledger> {
    return this.http.get<Ledger>(`${this.apiUrl}/${id}`);
  }

  createLedger(ledger: CreateLedgerDto): Observable<Ledger> {
    return this.http.post<Ledger>(this.apiUrl, ledger);
  }

  updateLedger(id: string, ledger: UpdateLedgerDto): Observable<Ledger> {
    return this.http.patch<Ledger>(`${this.apiUrl}/${id}`, ledger);
  }
}
