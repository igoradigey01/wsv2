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

import { ClientService } from './client.service';
import type {
  IClient,
  IClientSummary,
  IMark,
  IPayment,
  IShippedGood,
} from './client.models';
import { TabsComponent } from '../shared/tabs.component';
import { formatDay } from '../shared/date-format';
import { RecordEditDialogComponent } from './record-edit-dialog.component';
import type {
  EditableRecordKind,
  IRecordSaved,
} from './record-edit-dialog.component';

interface IClientLoadResult {
  client: IClient;
  summary: IClientSummary | null;
  marks: IMark[];
}

/** Открытое окно редактирования записи. */
interface IEditingRecord {
  kind: EditableRecordKind;
  dealId: string;
  id: number;
  title: string;
  amount: number;
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
  imports: [
    DatePipe,
    DecimalPipe,
    NgTemplateOutlet,
    RouterModule,
    TabsComponent,
    RecordEditDialogComponent,
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpoints = inject(BreakpointObserver);

  /** Узкий экран: блоки «Отпущенный товар» и «Принятые деньги» идут вкладками. */
  readonly isNarrow = toSignal(
    this.breakpoints
      .observe('(max-width: 767.98px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

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

  /** Выбранная строка таблицы (клик) и открытое окно редактирования (двойной клик). */
  readonly selectedProductId = signal<number | null>(null);
  readonly selectedPaymentId = signal<number | null>(null);
  readonly editing = signal<IEditingRecord | null>(null);

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

  /** Подпись способа оплаты: в БД лежит код 1–3. */
  paymentMethodLabel(method: number): string {
    switch (method) {
      case 2:
        return 'безнал';
      case 3:
        return 'карта';
      default:
        return 'наличные';
    }
  }

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

  selectProduct(product: IShippedGood | null): void {
    this.selectedProductId.set(product?.id ?? null);
  }

  selectPayment(payment: IPayment | null): void {
    this.selectedPaymentId.set(payment?.id ?? null);
  }

  /** Двойной клик по строке открывает окно редактирования. */
  editProduct(product: IShippedGood): void {
    const mark = this.selectedMark();
    if (!mark) {
      return;
    }

    this.selectedProductId.set(product.id);
    this.editing.set({
      kind: 'product',
      dealId: mark.id,
      id: product.id,
      title: `Накладная №${product.number}`,
      amount: product.amount,
    });
  }

  /** Двойной клик по строке открывает окно редактирования. */
  editPayment(payment: IPayment): void {
    const mark = this.selectedMark();
    if (!mark) {
      return;
    }

    const day = formatDay(payment.date);

    this.selectedPaymentId.set(payment.id);
    this.editing.set({
      kind: 'payment',
      dealId: mark.id,
      id: payment.id,
      title: day ? `Принятые деньги (${day})` : 'Принятые деньги',
      amount: payment.amount,
    });
  }

  closeEditor(): void {
    this.editing.set(null);
  }

  /** После сохранения обновляем суммы в списках, долг клиента и сделки. */
  applySaved(saved: IRecordSaved): void {
    if (saved.kind === 'product') {
      this.products.update((products) =>
        products.map((product) =>
          product.id === saved.id ? { ...product, amount: saved.amount } : product,
        ),
      );
    } else {
      this.payments.update((payments) =>
        payments.map((payment) =>
          payment.id === saved.id ? { ...payment, amount: saved.amount } : payment,
        ),
      );
    }

    this.refreshTotals();
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

  /** Долг и суммы сделок пересчитываются на сервере — перечитываем их. */
  private refreshTotals(): void {
    if (this.currentId === null) {
      return;
    }

    forkJoin({
      summary: this.clientService
        .getSummary(this.currentId)
        .pipe(catchError(() => of(null))),
      marks: this.clientService
        .getMarks(this.currentId)
        .pipe(catchError(() => of([]))),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result.summary) {
          this.summary.set(result.summary);
        }

        if (result.marks.length > 0) {
          this.marks.set(result.marks);
        }
      });
  }

  private resetDetails(): void {
    this.productsSub?.unsubscribe();
    this.paymentsSub?.unsubscribe();
    this.selectedMarkId.set(null);
    this.selectedProductId.set(null);
    this.selectedPaymentId.set(null);
    this.editing.set(null);
    this.products.set([]);
    this.payments.set([]);
    this.productsLoading.set(false);
    this.paymentsLoading.set(false);
    this.productsError.set(null);
    this.paymentsError.set(null);
    this.fromDate.set('');
  }
}
