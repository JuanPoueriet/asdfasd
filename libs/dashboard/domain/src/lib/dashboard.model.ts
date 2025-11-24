export interface Kpi {
    title: string;
    value: string;
    comparisonValue: string;
    comparisonPeriod: string;
    isPositive: boolean;
    iconName: string;
    color: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'teal';
}

export interface AlertItem {
    severity: 'critical' | 'warning';
    title: string;
    description: string;
}

export interface ExpenseCategory {
    name: string;
    y: number;
    color?: string;
}

export interface WorkingCapitalDto {
  workingCapital: number;
  date: Date;
}

export interface QuickRatioDto {
  quickRatio: number;
  date: Date;
}

export interface CurrentRatioDto {
  currentRatio: number;
  date: Date;
}

export interface RoadDto {
  roa: number;
  date: Date;
}

export interface RoeDto {
  roe: number;
  date: Date;
}

export interface LeverageDto {
  leverage: number;
  date: Date;
}

export interface NetMarginDto {
  netMargin: number;
  date: Date;
}

export interface EbitdaDto {
  ebitda: number;
  date: Date;
}

export interface FcfDto {
  freeCashFlow: number;
  date: Date;
}

export interface CashFlowWaterfallDto {
  openingBalance: number;
  operatingIncome: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  investments: number;
  financing: number;
  endingBalance: number;
}
