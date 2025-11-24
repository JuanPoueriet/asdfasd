import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
import { SearchResultGroup } from '@univeex/search/domain';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private apiUrl = `/api/search`;

  search(query: string): Observable<SearchResultGroup[]> {
    return this.http.get<SearchResultGroup[]>(this.apiUrl, { params: { q: query } });
  }
}
