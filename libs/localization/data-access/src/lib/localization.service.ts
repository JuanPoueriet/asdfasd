import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { FiscalRegion } from '@univeex/localization/domain';

@Injectable({
  providedIn: 'root',
})
export class LocalizationApiService {
  private http = inject(HttpClient);
  private apiUrl = `/api/localization`;

  getFiscalRegions(): Observable<FiscalRegion[]> {
    return this.http.get<FiscalRegion[]>(`${this.apiUrl}/fiscal-regions`);
  }

  getInitialLanguage(): string {
    return 'es';
  }

  setLanguage(lang: string): void {
    console.log('Set language to', lang);
  }
}
