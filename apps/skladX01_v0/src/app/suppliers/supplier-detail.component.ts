import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import type { Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, map } from 'rxjs/operators';

import { TabsComponent } from '../shared/tabs.component';
import { SupplierService } from './supplier.service';
import type {
  IReceivedGood,
  ISupplier,
  ISupplierDeal,
  ISupplierPayment,
  ISupplierSummary,
} from './supplier.models';

interface ISupplierLoadResult {
  supplier: ISupplier;
  summary: ISupplierSummary | null;
  deals: ISupplierDeal[];
}

function statusOf(error: unknown): number | null {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === 'number' ? status : null;
  }

  return null;
}

@Component({
  selector: 'app-supplier-detail',
  imports: [DatePipe, DecimalPipe, NgTemplateOutlet, RouterModule, TabsComponent],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplierService = inject(SupplierService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpoints = inject(BreakpointObserver);

  /** Узкий экран: блоки «Принятый товар» и «Отданные деньги» идут вкладками. */
  readonly isNarrow = toSignal(
    this.breakpoints
      .observe('(max-width: 767.98px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly supplier = signal<ISupplier | null>(null);
  readonly summary = signal<ISupplierSummary | null>(null);
  readonly deals = signal<ISupplierDeal[]>([]);
  readonly selectedDealId = signal<string | null>(null);

  readonly products = signal<IReceivedGood[]>([]);
  readonly payments = signal<ISupplierPayment[]>([]);

  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly error = signal<string | null>(null);

  readonly productsLoading = signal(false);
  readonly productsError = signal<string | null>(null);
  readonly paymentsLoading = signal(false);
  readonly paymentsError = signal<string | null>(null);

  readonly fromDate = signal('');
  readonly dealsOpen = signal(false);

  readonly selectedDeal = computed(
    () =>
      this.deals().find((deal) => deal.id === this.selectedDealId()) ?? null,
  );

  // API отдаёт сделки по возрастанию номера, поэтому «последняя» — хвост массива.
  readonly lastDeal = computed<ISupplierDeal | null>(() => {
    const deals = this.deals();

    return deals.length > 0 ? deals[deals.length - 1] : null;
  });

  readonly dealsDebt = computed(() =>
    this.deals().reduce((total, deal) => total + deal.debt, 0),
  );

  readonly filteredProducts = computed(() => {
    const from = this.fromDate();
    if (!from) {
      return this.products();
    }

    return this.products().filter(
      (product) => product.date.slice(0, 10) >= from,
    );
  });

  readonly filteredPayments = computed(() => {
    const from = this.fromDate();
    if (!from) {
      return this.payments();
    }

    return this.payments().filter((payment) => payment.date.slice(0, 10) >= from);
  });

  readonly productsTotal = computed(() =>
    this.filteredProducts().reduce((total, product) => total + product.amount, 0),
  );

  readonly paymentsTotal = computed(() =>
    this.filteredPayments().reduce((total, payment) => total + payment.amount, 0),
  );

  private currentId: number | null = null;
  private supplierSub: Subscription | null = null;
  private productsSub: Subscription | null = null;
  private paymentsSub: Subscription | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((supplierId) => {
        if (!Number.isFinite(supplierId)) {
          this.loading.set(false);
          this.notFound.set(true);
          return;
        }

        this.currentId = supplierId;
        this.startLoad(supplierId);
      });
  }

  selectDeal(deal: ISupplierDeal): void {
    this.selectedDealId.set(deal.id);
    this.loadProducts(deal.id);
    this.loadPayments(deal.id);
  }

  toggleDeals(): void {
    this.dealsOpen.update((open) => !open);
  }

  setFromDate(event: Event): void {
    this.fromDate.set((event.target as HTMLInputElement).value);
  }

  retry(): void {
    if (this.currentId !== null) {
      this.startLoad(this.currentId);
    }
  }

  retryProducts(): void {
    const deal = this.selectedDeal();
    if (deal) {
      this.loadProducts(deal.id);
    }
  }

  retryPayments(): void {
    const deal = this.selectedDeal();
    if (deal) {
      this.loadPayments(deal.id);
    }
  }

  private startLoad(supplierId: number): void {
    this.supplierSub?.unsubscribe();
    this.resetDetails();

    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);
    this.supplier.set(null);
    this.summary.set(null);
    this.deals.set([]);

    this.supplierSub = forkJoin({
      supplier: this.supplierService.getSupplier(supplierId),
      summary: this.supplierService
        .getSummary(supplierId)
        .pipe(catchError(() => of(null))),
      deals: this.supplierService.getDeals(supplierId),
    })
      .pipe(
        catchError((error: unknown) => {
          this.loading.set(false);

          if (statusOf(error) === 404) {
            this.notFound.set(true);
          } else {
            this.error.set(
              'Не удалось загрузить карточку поставщика. Проверьте, что SkladApi запущен на http://localhost:5240.',
            );
          }

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => this.applySupplier(result));
  }

  private applySupplier(result: ISupplierLoadResult | null): void {
    this.loading.set(false);

    if (result === null) {
      return;
    }

    this.supplier.set(result.supplier);
    this.summary.set(result.summary);
    this.deals.set(result.deals);

    const latest = this.lastDeal();
    if (latest) {
      this.selectDeal(latest);
    }
  }

  private loadProducts(dealId: string): void {
    this.productsSub?.unsubscribe();
    this.products.set([]);
    this.productsError.set(null);
    this.productsLoading.set(true);

    this.productsSub = this.supplierService
      .getDealProducts(dealId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          if (this.selectedDealId() !== dealId) {
            return;
          }

          this.products.set(products);
          this.productsLoading.set(false);
        },
        error: () => {
          this.productsLoading.set(false);
          this.productsError.set('Не удалось загрузить принятый товар.');
        },
      });
  }

  private loadPayments(dealId: string): void {
    this.paymentsSub?.unsubscribe();
    this.payments.set([]);
    this.paymentsError.set(null);
    this.paymentsLoading.set(true);

    this.paymentsSub = this.supplierService
      .getDealPayments(dealId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (payments) => {
          if (this.selectedDealId() !== dealId) {
            return;
          }

          this.payments.set(payments);
          this.paymentsLoading.set(false);
        },
        error: () => {
          this.paymentsLoading.set(false);
          this.paymentsError.set('Не удалось загрузить отданные деньги.');
        },
      });
  }

  private resetDetails(): void {
    this.productsSub?.unsubscribe();
    this.paymentsSub?.unsubscribe();
    this.selectedDealId.set(null);
    this.products.set([]);
    this.payments.set([]);
    this.productsLoading.set(false);
    this.paymentsLoading.set(false);
    this.productsError.set(null);
    this.paymentsError.set(null);
    this.fromDate.set('');
    this.dealsOpen.set(false);
  }
}
