import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import type { Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, map } from 'rxjs/operators';

import { ClientService } from './client.service';
import type {
  IClient,
  IClientSummary,
  IMark,
  IPayment,
  IShippedGood,
} from './client.models';

interface IClientLoadResult {
  client: IClient;
  summary: IClientSummary | null;
  marks: IMark[];
}

function statusOf(error: unknown): number | null {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === 'number' ? status : null;
  }

  return null;
}

@Component({
  selector: 'app-client-detail',
  imports: [DatePipe, DecimalPipe, RouterModule],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly client = signal<IClient | null>(null);
  readonly summary = signal<IClientSummary | null>(null);
  readonly marks = signal<IMark[]>([]);
  readonly selectedMarkId = signal<string | null>(null);

  readonly creating = signal(false);
  readonly createError = signal<string | null>(null);
  readonly newComment = signal('');

  readonly products = signal<IShippedGood[]>([]);
  readonly payments = signal<IPayment[]>([]);

  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly error = signal<string | null>(null);

  readonly productsLoading = signal(false);
  readonly productsError = signal<string | null>(null);
  readonly paymentsLoading = signal(false);
  readonly paymentsError = signal<string | null>(null);

  readonly fromDate = signal('');

  readonly dealsOpen = signal(false);
  readonly changedProductIds = signal<ReadonlySet<number>>(new Set<number>());
  readonly changedPaymentIds = signal<ReadonlySet<number>>(new Set<number>());

  readonly selectedMark = computed(
    () => this.marks().find((mark) => mark.id === this.selectedMarkId()) ?? null,
  );

  // API отдаёт сделки по возрастанию НомерСделки, поэтому «последняя» — хвост массива.
  readonly lastMark = computed<IMark | null>(() => {
    const marks = this.marks();

    return marks.length > 0 ? marks[marks.length - 1] : null;
  });

  readonly marksDebt = computed(() =>
    this.marks().reduce((total, mark) => total + mark.debt, 0),
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
  private clientSub: Subscription | null = null;
  private productsSub: Subscription | null = null;
  private paymentsSub: Subscription | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((id) => {
        if (!Number.isFinite(id)) {
          this.loading.set(false);
          this.notFound.set(true);
          return;
        }

        this.currentId = id;
        this.startLoad(id);
      });
  }

  selectMark(mark: IMark): void {
    this.selectedMarkId.set(mark.id);
    this.loadProducts(mark.id);
    this.loadPayments(mark.id);
  }

  toggleDeals(): void {
    this.dealsOpen.update((open) => !open);
  }

  setNewComment(event: Event): void {
    this.newComment.set((event.target as HTMLInputElement).value);
  }

  createDeal(): void {
    if (this.currentId === null || this.creating()) {
      return;
    }

    const comment = this.newComment().trim();

    this.creating.set(true);
    this.createError.set(null);

    this.clientService
      .createMark(this.currentId, { комментарий: comment || undefined })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (mark) => {
          this.creating.set(false);
          this.newComment.set('');
          this.dealsOpen.set(true);
          this.marks.update((marks) => [...marks, mark]);
          this.selectMark(mark);
        },
        error: () => {
          this.creating.set(false);
          this.createError.set('Не удалось создать сделку. Проверьте SkladApi.');
        },
      });
  }

  toggleDemoProduct(): void {
    const first = this.filteredProducts()[0];
    if (!first) {
      return;
    }

    this.changedProductIds.update((ids) => this.toggleId(ids, first.id));
  }

  toggleDemoPayment(): void {
    const first = this.filteredPayments()[0];
    if (!first) {
      return;
    }

    this.changedPaymentIds.update((ids) => this.toggleId(ids, first.id));
  }

  private toggleId(ids: ReadonlySet<number>, id: number): ReadonlySet<number> {
    const next = new Set(ids);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    return next;
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
    const mark = this.selectedMark();
    if (mark) {
      this.loadProducts(mark.id);
    }
  }

  retryPayments(): void {
    const mark = this.selectedMark();
    if (mark) {
      this.loadPayments(mark.id);
    }
  }

  private startLoad(clientId: number): void {
    this.clientSub?.unsubscribe();
    this.resetDetails();

    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);
    this.client.set(null);
    this.summary.set(null);
    this.marks.set([]);

    this.clientSub = forkJoin({
      client: this.clientService.getClient(clientId),
      summary: this.clientService
        .getSummary(clientId)
        .pipe(catchError(() => of(null))),
      marks: this.clientService.getMarks(clientId),
    })
      .pipe(
        catchError((error: unknown) => {
          this.loading.set(false);

          if (statusOf(error) === 404) {
            this.notFound.set(true);
          } else {
            this.error.set(
              'Не удалось загрузить карточку клиента. Проверьте, что SkladApi запущен на http://localhost:5240.',
            );
          }

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => this.applyClient(result));
  }

  private applyClient(result: IClientLoadResult | null): void {
    this.loading.set(false);

    if (result === null) {
      return;
    }

    this.client.set(result.client);
    this.summary.set(result.summary);
    this.marks.set(result.marks);

    const latest = this.lastMark();
    if (latest) {
      this.selectMark(latest);
    }
  }

  private loadProducts(dealId: string): void {
    this.productsSub?.unsubscribe();
    this.products.set([]);
    this.productsError.set(null);
    this.productsLoading.set(true);

    this.productsSub = this.clientService
      .getProducts(dealId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          if (this.selectedMarkId() !== dealId) {
            return;
          }

          this.products.set(products);
          this.productsLoading.set(false);
        },
        error: () => {
          this.productsLoading.set(false);
          this.productsError.set('Не удалось загрузить отгруженные товары.');
        },
      });
  }

  private loadPayments(dealId: string): void {
    this.paymentsSub?.unsubscribe();
    this.payments.set([]);
    this.paymentsError.set(null);
    this.paymentsLoading.set(true);

    this.paymentsSub = this.clientService
      .getPayments(dealId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (payments) => {
          if (this.selectedMarkId() !== dealId) {
            return;
          }

          this.payments.set(payments);
          this.paymentsLoading.set(false);
        },
        error: () => {
          this.paymentsLoading.set(false);
          this.paymentsError.set('Не удалось загрузить принятые деньги.');
        },
      });
  }

  private resetDetails(): void {
    this.productsSub?.unsubscribe();
    this.paymentsSub?.unsubscribe();
    this.selectedMarkId.set(null);
    this.products.set([]);
    this.payments.set([]);
    this.productsLoading.set(false);
    this.paymentsLoading.set(false);
    this.productsError.set(null);
    this.paymentsError.set(null);
    this.fromDate.set('');
  }
}
