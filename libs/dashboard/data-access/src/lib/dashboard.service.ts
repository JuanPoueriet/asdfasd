import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
import {
  WorkingCapitalDto,
  QuickRatioDto,
  CurrentRatioDto,
  RoadDto,
  RoeDto,
  LeverageDto,
  NetMarginDto,
  EbitdaDto,
  FcfDto,
  CashFlowWaterfallDto
} from '@univeex/dashboard/domain';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {
  private http = inject(HttpClient);
  private apiUrl = `/api/dashboard`;

  getWorkingCapital(): Observable<WorkingCapitalDto> {
    return this.http.get<WorkingCapitalDto>(`${this.apiUrl}/kpi/working-capital`);
  }

  getQuickRatio(): Observable<QuickRatioDto> {
    return this.http.get<QuickRatioDto>(`${this.apiUrl}/kpi/quick-ratio`);
  }

  getCurrentRatio(): Observable<CurrentRatioDto> {
    return this.http.get<CurrentRatioDto>(`${this.apiUrl}/kpi/current-ratio`);
  }

  getROA(): Observable<RoadDto> {
    return this.http.get<RoadDto>(`${this.apiUrl}/kpi/roa`);
  }

  getROE(): Observable<RoeDto> {
    return this.http.get<RoeDto>(`${this.apiUrl}/kpi/roe`);
  }

  getLeverage(): Observable<LeverageDto> {
    return this.http.get<LeverageDto>(`${this.apiUrl}/kpi/leverage`);
  }

  getNetMargin(): Observable<NetMarginDto> {
    return this.http.get<NetMarginDto>(`${this.apiUrl}/kpi/net-margin`);
  }

  getEBITDA(): Observable<EbitdaDto> {
    return this.http.get<EbitdaDto>(`${this.apiUrl}/kpi/ebitda`);
  }

  getFreeCashFlow(): Observable<FcfDto> {
    return this.http.get<FcfDto>(`${this.apiUrl}/kpi/fcf`);
  }

  getConsolidatedCashFlowWaterfall(): Observable<CashFlowWaterfallDto> {
    return this.http.get<CashFlowWaterfallDto>(`${this.apiUrl}/consolidated-cash-flow-waterfall`);
  }
}
