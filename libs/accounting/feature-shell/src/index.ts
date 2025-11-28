export * from './lib/accounting.routes';
export * from './lib/accounting.module';
// Warning: PeriodLockGuard was not found in 'feature-shell' but in 'api-feature-chart-of-accounts'.
// However, the error log says: Module '"@univeex/accounting/feature-shell"' has no exported member 'PeriodLockGuard'.
// This implies the consumer expects it there.
// If it's not there, I should check where 'PeriodLockGuard' actually is.
// Found in: libs/accounting/api-feature-chart-of-accounts/src/lib/guards/period-lock.guard.ts
// I will export it from there if it's not already.
// And change the import in consumers to point to '@univeex/accounting/api-feature-chart-of-accounts' OR move/re-export it.
// The consumer code has: import { PeriodLockGuard } from '@univeex/accounting/feature-shell';
// I will check if 'feature-shell' can export it from 'api-feature-chart-of-accounts'.
