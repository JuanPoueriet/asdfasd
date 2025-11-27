import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CreditCard, Download, CheckCircle, Info } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { BillingService } from '@univeex/accounting/web-data-access';
import { Subscription, PaymentMethod, PaymentHistoryItem } from '@univeex/accounting/domain';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPage implements OnInit {
  private billingService: BillingService = inject(BillingService);

  protected readonly CreditCardIcon = CreditCard;
  protected readonly DownloadIcon = Download;
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly InfoIcon = Info;

  subscription = toSignal(this.billingService.getSubscription());
  paymentMethod = toSignal(this.billingService.getPaymentMethod());
  paymentHistory = toSignal(this.billingService.getPaymentHistory(), { initialValue: [] as PaymentHistoryItem[] });

  selectedPlan = signal<'trial' | 'pro' | 'enterprise'>('pro');
  isSaving = signal(false);

  ngOnInit(): void {
    const currentPlanId = this.subscription()?.planId;
    if (currentPlanId) {
      this.selectedPlan.set(currentPlanId);
    }
  }

  selectPlan(planId: 'trial' | 'pro' | 'enterprise'): void {
    this.selectedPlan.set(planId);
  }

  updatePlan(): void {
    this.isSaving.set(true);
    this.billingService.changePlan(this.selectedPlan()).subscribe({
      next: () => {
        console.log('Plan actualizado con éxito');
        this.isSaving.set(false);
      },
      error: () => {
        console.error('Error al actualizar el plan');
        this.isSaving.set(false);
      }
    });
  }
}
