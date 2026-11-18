import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  AfterViewInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { IInvoiceRowUpdate } from './client.models';
import { ClientService } from './client.service';
import { SupplierService } from '../suppliers/supplier.service';
import type { IAuditEntry, AuditEntityType } from '../shared/audit.models';
import { actionLabel, paymentSums } from '../shared/audit.models';
import { AuditService } from '../shared/audit.service';
import { ToastService } from '../shared/toast.service';
import type { Observable } from 'rxjs';

export type EditableRecordKind = 'product' | 'payment';

/** Чей документ редактируется: клиента или поставщика. */
export type RecordSource = 'client' | 'supplier';

export interface IRecordSaved {
  kind: EditableRecordKind;
  id: number | string;
  /** Новая сумма накладной или платежа. */
  amount: number;
}

/** Общая форма строки накладной и прихода. */
interface IRowResult {
  id: number;
  name: string;
  quantity: number;
  price: number;
  amount: number;
}

interface IEditableRow {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

/** Пустое поле и «1,5» через запятую — допустимый ввод пользователя. */
function readNumber(event: Event): number | null {
  const raw = (event.target as HTMLInputElement).value
    .replace(',', '.')
    .trim();

  if (raw === '') {
    return null;
  }

  const value = Number(raw);

  return Number.isFinite(value) ? value : null;
}

/**
 * Окно редактирования записи: вкладка «Данные» (строки накладной или сумма
 * платежа) и вкладка «История» из журнала аудита.
 */
@Component({
  selector: 'app-record-edit-dialog',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './record-edit-dialog.component.html',
  styleUrl: './record-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordEditDialogComponent implements OnInit, AfterViewInit {
  private readonly clientService = inject(ClientService);
  private readonly supplierService = inject(SupplierService);
  private readonly auditService = inject(AuditService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly dealId = input.required<string>();
  readonly kind = input.required<EditableRecordKind>();
  /** У клиента — int, у поставщика накладная — Guid строкой. */
  readonly recordId = input.required<number | string>();
  /** Числовой ключ для истории: у прихода это первая строка, а не UETR. */
  readonly auditId = input<number | null>(null);
  readonly source = input<RecordSource>('client');
  readonly title = input('');
  readonly amount = input(0);

  readonly saved = output<IRecordSaved>();
  readonly closed = output<void>();

  @ViewChild('firstTab')
  private firstTab?: ElementRef<HTMLButtonElement>;

  readonly tab = signal<'data' | 'history'>('data');

  readonly rows = signal<IEditableRow[]>([]);
  readonly paymentAmount = signal(0);
  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);

  readonly history = signal<IAuditEntry[]>([]);
  readonly historyLoading = signal(false);
  readonly historyError = signal<string | null>(null);

  readonly actionLabel = actionLabel;
  readonly paymentSums = paymentSums;

  readonly total = computed(() =>
    this.rows().reduce((sum, row) => sum + row.quantity * row.price, 0),
  );

  readonly invalid = computed(
    () =>
      this.kind() === 'product' &&
      (this.rows().length === 0 ||
        this.rows().some(
          (row) =>
            !Number.isFinite(row.quantity) ||
            row.quantity <= 0 ||
            !Number.isFinite(row.price) ||
            row.price < 0,
        )),
  );

  readonly paymentInvalid = computed(() => {
    const value = this.paymentAmount();

    return !Number.isFinite(value) || value < 0;
  });

  ngOnInit(): void {
    if (this.kind() === 'payment') {
      this.paymentAmount.set(this.amount());
    } else {
      this.loadRows();
    }

    this.loadHistory();
  }

  ngAfterViewInit(): void {
    this.firstTab?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  setTab(tab: 'data' | 'history'): void {
    this.tab.set(tab);
  }

  setQuantity(id: number, event: Event): void {
    const value = readNumber(event);

    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === id ? { ...row, quantity: value ?? 0 } : row,
      ),
    );
  }

  setPrice(id: number, event: Event): void {
    const value = readNumber(event);

    this.rows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, price: value ?? 0 } : row)),
    );
  }

  setPaymentAmount(event: Event): void {
    this.paymentAmount.set(readNumber(event) ?? 0);
  }

  rowAmount(row: IEditableRow): number {
    return Math.round(row.quantity * row.price * 100) / 100;
  }

  save(): void {
    if (this.saving()) {
      return;
    }

    if (this.kind() === 'payment') {
      this.savePayment();
    } else {
      this.saveRows();
    }
  }

  retryLoad(): void {
    if (this.kind() === 'product') {
      this.loadRows();
    }

    this.loadHistory();
  }

  close(): void {
    if (!this.saving()) {
      this.closed.emit();
    }
  }

  /** Клик по подложке закрывает окно, клик внутри — нет. */
  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  private saveRows(): void {
    if (this.invalid()) {
      return;
    }

    const updates: IInvoiceRowUpdate[] = this.rows().map((row) => ({
      id: row.id,
      quantity: row.quantity,
      price: row.price,
    }));

    const request$: Observable<IRowResult[]> =
      this.source() === 'supplier'
        ? this.rowsRequest(updates)
        : this.clientService.updateInvoiceRows(
            this.dealId(),
            Number(this.recordId()),
            updates,
          );

    this.saving.set(true);
    this.saveError.set(null);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => this.finishRowsSave(rows),
        error: () => {
          this.saving.set(false);
          this.saveError.set(
            'Не удалось сохранить накладную. Проверьте SkladApi.',
          );
        },
      });
  }

  private rowsRequest(updates: IInvoiceRowUpdate[]): Observable<IRowResult[]> {
    return this.supplierService.updateReceiptRows(
      this.dealId(),
      String(this.recordId()),
      updates,
    );
  }

  private finishRowsSave(rows: IRowResult[]): void {
    this.rows.set(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        price: row.price,
      })),
    );

    this.saving.set(false);
    this.toast.show('Строки накладной сохранены.');
    this.saved.emit({
      kind: 'product',
      id: this.recordId(),
      amount: rows.reduce((sum, row) => sum + row.amount, 0),
    });
    this.loadHistory();
  }

  private savePayment(): void {
    if (this.paymentInvalid()) {
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    const request$: Observable<{ amount: number; id: number | string }> =
      this.source() === 'supplier'
        ? this.supplierService.updateSupplierPayment(
            this.dealId(),
            Number(this.recordId()),
            this.paymentAmount(),
          )
        : this.clientService.updatePayment(
            this.dealId(),
            Number(this.recordId()),
            this.paymentAmount(),
          );

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (payment) => {
          this.paymentAmount.set(payment.amount);
          this.saving.set(false);
          this.toast.show('Сумма платежа сохранена.');
          this.saved.emit({
            kind: 'payment',
            id: payment.id,
            amount: payment.amount,
          });
          this.loadHistory();
        },
        error: () => {
          this.saving.set(false);
          this.saveError.set(
            'Не удалось сохранить сумму платежа. Проверьте SkladApi.',
          );
        },
      });
  }

  private loadRows(): void {
    this.loading.set(true);
    this.loadError.set(null);

    const request$: Observable<IRowResult[]> =
      this.source() === 'supplier'
        ? this.supplierService.getReceiptRows(
            this.dealId(),
            String(this.recordId()),
          )
        : this.clientService.getInvoiceRows(
            this.dealId(),
            Number(this.recordId()),
          );

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.rows.set(
            rows.map((row) => ({
              id: row.id,
              name: row.name,
              quantity: row.quantity,
              price: row.price,
            })),
          );
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadError.set('Не удалось загрузить строки накладной.');
        },
      });
  }

  /** История грузится при открытии окна и повторно — после сохранения. */
  private loadHistory(): void {
    const entityType: AuditEntityType =
      this.source() === 'supplier'
        ? this.kind() === 'payment'
          ? 'supplier-payment'
          : 'supplier-invoice'
        : this.kind() === 'payment'
          ? 'payment'
          : 'invoice';

    const entityId =
      this.source() === 'supplier' && this.kind() === 'product'
        ? this.auditId() ?? 0
        : Number(this.recordId());

    this.historyLoading.set(true);
    this.historyError.set(null);

    this.auditService
      .getHistory(entityType, entityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (entries) => {
          this.history.set(entries);
          this.historyLoading.set(false);
        },
        error: () => {
          this.historyLoading.set(false);
          this.historyError.set('Не удалось загрузить историю изменений.');
        },
      });
  }
}
