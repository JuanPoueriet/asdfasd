// src/app/layout/main/main.layout.ts

import {
  Component,
  inject,
  signal,
  HostListener,
  ElementRef,
  HostBinding,
  OnInit,
  WritableSignal,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { BrandingService } from '../../core/services/branding';
import { NotificationCenterService } from '../../core/services/notification-center.service';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';
import {
  SearchService,
  SearchResultGroup,
} from '../../core/services/search.service';
import { Subject, of, Subscription } from 'rxjs';
import {
  debounceTime,
  switchMap,
  catchError,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import {
  LucideAngularModule,
  Search,
  PlusCircle,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  Users,
  HardHat,
  CheckSquare,
  FolderArchive,
  Database,
  UploadCloud,
  DownloadCloud,
  BookCopy,
  BarChartBig,
  Truck,
  X,
  ChevronRight,
  ArrowRight,
  FileText,
  Building,
  CreditCard,
  Calendar,
  UserPlus,
  FileSearch,
} from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Sidebar } from '../sidebar/sidebar';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ThemeToggle,
    LucideAngularModule,
    TranslateModule,
    Sidebar,
    ClickOutsideDirective,
  ],
  templateUrl: './main.layout.html',
  styleUrls: ['./main.layout.scss'],
})
export class MainLayout implements OnInit, OnDestroy {
  notificationCenter = inject(NotificationCenterService);

  isQuickCreateModalOpen: WritableSignal<boolean> = signal(false);

  // --- Lógica corregida para Shortcuts ---
  private keydownSubscription: Subscription | null = null;

  // Método mejorado para manejar shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Verificar que sea Ctrl + Alt + letra
    if (event.ctrlKey && event.altKey && !event.shiftKey && !event.metaKey) {
      const key = event.key.toUpperCase();
      
      switch (key) {
        case 'I': // Ctrl + Alt + I
          event.preventDefault();
          event.stopPropagation();
          this.router.navigate(['/app/invoices/new']);
          this.closeQuickCreateModal();
          break;
        case 'Q': // Ctrl + Alt + Q
          event.preventDefault();
          event.stopPropagation();
          this.router.navigate(['/app/quotes/new']);
          this.closeQuickCreateModal();
          break;
        case 'C': // Ctrl + Alt + C
          event.preventDefault();
          event.stopPropagation();
          this.router.navigate(['/app/contacts/customers/new']);
          this.closeQuickCreateModal();
          break;
        case 'P': // Ctrl + Alt + P
          event.preventDefault();
          event.stopPropagation();
          this.router.navigate(['/app/inventory/products/new']);
          this.closeQuickCreateModal();
          break;
        default:
          // No hacer nada para otras teclas
          return;
      }
      
      console.log(`Shortcut activated: Ctrl+Alt+${key}`);
    }
  }

  toggleQuickCreateModal(): void {
    this.isQuickCreateModalOpen.update((value) => !value);
    this.isUserMenuOpen.set(false);
    this.isNotificationMenuOpen.set(false);
  }

  closeQuickCreateModal(): void {
    this.isQuickCreateModalOpen.set(false);
  }

  ngOnInit(): void {
    this.notificationCenter.initialize();

    this.searchQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => {
          if (query.trim().length > 0) {
            this.isSearchLoading.set(true);
            this.isSearchOpen.set(true);
          } else {
            this.isSearchLoading.set(false);
            this.isSearchOpen.set(false);
            this.searchResults.set([]);
          }
        }),
        switchMap((query) => {
          if (query.trim().length > 0) {
            return this.searchService
              .search(query.trim())
              .pipe(catchError(() => of([] as SearchResultGroup[])));
          } else {
            return of([] as SearchResultGroup[]);
          }
        })
      )
      .subscribe((results) => {
        this.searchResults.set(results);
        this.isSearchLoading.set(false);
      });
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    if (this.keydownSubscription) {
      this.keydownSubscription.unsubscribe();
    }
  }

  private elementRef = inject(ElementRef);
  authService = inject(AuthService);
  brandingService = inject(BrandingService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  settings = this.brandingService.settings;
  isUserMenuOpen = signal(false);
  isNotificationMenuOpen = signal(false);
  isSearchOpen = signal(false);
  searchResults = signal<SearchResultGroup[]>([]);
  isSearchLoading = signal(false);
  private searchQuery$ = new Subject<string>();

  @HostBinding('class')
  get layoutClass() {
    return `layout-${this.settings().layoutStyle}`;
  }

  stopImpersonation(): void {
    this.authService.stopImpersonation().subscribe();
  }

  // Íconos corregidos - sin duplicados
  protected readonly SearchIcon = Search;
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly BellIcon = Bell;
  protected readonly UserIcon = User;
  protected readonly SettingsIcon = Settings;
  protected readonly LogOutIcon = LogOut;
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly XIcon = X;
  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly DashboardIcon = LayoutDashboard;
  protected readonly MyWorkIcon = HardHat;
  protected readonly ApprovalsIcon = CheckSquare;
  protected readonly DocumentsIcon = FolderArchive;
  protected readonly SalesIcon = ShoppingCart;
  protected readonly InvoicesIcon = Receipt;
  protected readonly InventoryIcon = Package;
  protected readonly ContactsIcon = Users;
  protected readonly MastersIcon = Database;
  protected readonly DataImportsIcon = UploadCloud;
  protected readonly DataExportsIcon = DownloadCloud;
  protected readonly AccountingIcon = BookCopy;
  protected readonly ReportsIcon = BarChartBig;
  protected readonly PurchasingIcon = Truck;
  protected readonly FileTextIcon = FileText;
  protected readonly BuildingIcon = Building;
  protected readonly CreditCardIcon = CreditCard;
  protected readonly CalendarIcon = Calendar;
  protected readonly FileSearchIcon = FileSearch;
  protected readonly UserPlusIcon = UserPlus;

  // Alias para compatibilidad con template
  protected readonly PackageIcon = Package;
  protected readonly ReceiptIcon = Receipt;

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((isOpen) => !isOpen);
    this.closeNotificationMenu();
    this.closeQuickCreateModal();
  }

  toggleNotificationMenu(): void {
    this.isNotificationMenuOpen.update((isOpen) => !isOpen);
    this.closeUserMenu();
    this.closeQuickCreateModal();
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  closeNotificationMenu(): void {
    this.isNotificationMenuOpen.set(false);
  }

  navigateToSearch(query: string): void {
    if (query && query.trim().length > 0) {
      this.router.navigate(['/app/global-search'], {
        queryParams: { q: query.trim() },
      });
      this.closeSearch();
    }
  }

  onSearchInput(query: string): void {
    this.searchQuery$.next(query);
  }

  onSearchFocus(): void {
    if (this.searchResults().length > 0) {
      this.isSearchOpen.set(true);
    }
  }

  closeSearch(): void {
    this.isSearchOpen.set(false);
  }

  getIconForType(type: string): any {
    if (!type) {
      return this.FileSearchIcon;
    }

    const lowerCaseType = type.toLowerCase();
    const iconMap: { [key: string]: any } = {
      customers: this.UserIcon,
      products: this.PackageIcon,
      invoices: this.InvoicesIcon,
      documents: this.FileTextIcon,
      companies: this.BuildingIcon,
      payments: this.CreditCardIcon,
      events: this.CalendarIcon,
      sales: this.SalesIcon,
      dashboard: this.DashboardIcon,
      inventory: this.InventoryIcon,
      contacts: this.ContactsIcon,
      users: this.UserIcon,
      settings: this.SettingsIcon,
      reports: this.ReportsIcon,
      purchases: this.PurchasingIcon,
    };

    return iconMap[lowerCaseType] || this.FileSearchIcon;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const searchElement =
      this.elementRef.nativeElement.querySelector('.global-search');
    if (searchElement && !searchElement.contains(event.target as Node)) {
      this.closeSearch();
    }
  }
}