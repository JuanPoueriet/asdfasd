
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChartOfAccountsApiService, CreateAccountDto, UpdateAccountDto } from '@univeex/accounting/web-data-access';
import { ChartOfAccountsStateService } from '@univeex/accounting/web-data-access';
import { take } from 'rxjs/operators';
import { AccountType, AccountCategory, AccountNature, CashFlowCategory, RequiredDimension } from '@univeex/accounting/domain';
import { LucideAngularModule, Save } from 'lucide-angular';
import { NotificationService } from '@univeex/notifications/data-access';

@Component({
  selector: 'app-account-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './account-form.page.html',
  styles: [],
})
export class AccountFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apiService = inject(ChartOfAccountsApiService);
  private stateService = inject(ChartOfAccountsStateService);
  private notificationService = inject(NotificationService);

  form!: FormGroup;
  isLoading = signal(false);
  accountId: string | null = null;
  isEditing = signal(false);

  // Enums for dropdowns
  accountTypes = Object.values(AccountType);
  accountCategories = Object.values(AccountCategory);
  accountNatures = Object.values(AccountNature);
  cashFlowCategories = Object.values(CashFlowCategory);
  requiredDimensions = Object.values(RequiredDimension);

  ngOnInit(): void {
    this.initForm();
    this.accountId = this.route.snapshot.paramMap.get('id');
    if (this.accountId) {
      this.isEditing.set(true);
      this.loadAccountData(this.accountId);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      type: [AccountType.ASSET, Validators.required],
      category: [AccountCategory.CURRENT_ASSET, Validators.required],
      nature: [AccountNature.DEBIT, Validators.required],
      parentId: [null],
      isActive: [true],
      isPostable: [true],
      isSystemAccount: [false],
      isMultiCurrency: [false],
      effectiveFrom: [null],
      effectiveTo: [null],
      statementMapping: this.fb.group({
        balanceSheetCategory: [''],
        incomeStatementCategory: [''],
        cashFlowCategory: [null],
      }),
      rules: this.fb.group({
        requiresReconciliation: [false],
        isCashOrBank: [false],
        allowsIntercompany: [false],
        isFxRevaluation: [false],
        requiredDimensions: [[]],
      }),
    });
  }

  private loadAccountData(id: string): void {
    this.isLoading.set(true);
    this.apiService.getAccountById(id).pipe(take(1)).subscribe({
      next: (account) => {
        // Usar patchValue para el formulario principal.
        // TypeORM puede devolver entidades con campos extra que no están en el DTO.
        this.form.patchValue(account);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.notificationService.showError('Error al cargar la cuenta.');
        this.isLoading.set(false);
        this.router.navigate(['/app/accounting/chart-of-accounts']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.form.value;

    // Preparar payload. Asegurarse de tipos correctos.
    const payload: CreateAccountDto | UpdateAccountDto = {
        ...formValue,
        // Ensure segments are handled if required by DTO, though usually derived from code
        // For update, code might be read-only in backend
    };

    const saveOperation = this.isEditing()
      ? this.apiService.updateAccount(this.accountId!, payload)
      : this.apiService.createAccount(payload as CreateAccountDto);

    saveOperation.pipe(take(1)).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Cuenta ${this.isEditing() ? 'actualizada' : 'creada'} con éxito.`);
        this.stateService.refreshAccounts();
        this.router.navigate(['/app/accounting/chart-of-accounts']);
      },
      error: (err) => {
        this.notificationService.showError(`Error al guardar: ${err.message}`);
        this.isLoading.set(false);
      }
    });
  }
}
