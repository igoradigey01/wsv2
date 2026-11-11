import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { InvoiceService } from '../invoice/invoice.service';
import type { ICandidate } from '../invoice/invoice.service';
import { SupplierService } from './supplier.service';
import type { ISupplier, IWarehouse } from './supplier.models';

export interface IReceiptRow {
  id: number;
  productId: number | null;
  name: string;
  unit: string | null;
  qty: number;
  price: number;
  candidates: ICandidate[];
  candidatesLoading: boolean;
}

const CANDIDATES_DEBOUNCE_MS = 400;

@Component({
  selector: 'app-receipt-page',
  imports: [DecimalPipe, RouterModule],
  templateUrl: './receipt-page.component.html',
  styleUrl: './receipt-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplierService = inject(SupplierService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly destroyRef = inject(DestroyRef);

  readonly supplierId = signal<number | null>(null);
  readonly supplier = signal<ISupplier | null>(null);
  readonly warehouses = signal<IWarehouse[]>([]);
  readonly warehouseId = signal<number | null>(null);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly date = signal(new Date().toISOString().slice(0, 10));
  readonly comment = signal('');

  readonly rows = signal<IReceiptRow[]>([
    {
      id: 1,
      productId: null,
      name: '',
      unit: null,
      qty: 1,
      price: 0,
      candidates: [],
      candidatesLoading: false,
    },
  ]);
  private readonly lastRowId = signal(1);

  private readonly candidateTimers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly total = computed(() =>
    this.rows().reduce((sum, row) => sum + row.qty * row.price, 0),
  );

  ngOnInit(): void {
    const supplierId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(supplierId)) {
      this.loading.set(false);
      this.error.set('Некорректный поставщик.');
      return;
    }

    this.supplierId.set(supplierId);

    forkJoin({
      supplier: this.supplierService.getSupplier(supplierId),
      warehouses: this.supplierService.getWarehouses(),
    })
      .pipe(
        catchError(() => {
          this.loading.set(false);
          this.error.set(
            'Не удалось загрузить данные. Проверьте, что SkladApi запущен на http://localhost:5240.',
          );

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.loading.set(false);

        if (result) {
          this.supplier.set(result.supplier);
          this.warehouses.set(result.warehouses);
          this.warehouseId.set(result.warehouses[0]?.id ?? null);
        }
      });
  }

  setDate(event: Event): void {
    this.date.set((event.target as HTMLInputElement).value);
  }

  setComment(event: Event): void {
    this.comment.set((event.target as HTMLTextAreaElement).value);
  }

  setWarehouse(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;

    this.warehouseId.set(raw === '' ? null : Number(raw));
  }

  addRow(): void {
    const id = this.lastRowId() + 1;
    this.lastRowId.set(id);
    this.rows.update((rows) => [
      ...rows,
      {
        id,
        productId: null,
        name: '',
        unit: null,
        qty: 1,
        price: 0,
        candidates: [],
        candidatesLoading: false,
      },
    ]);
  }

  removeRow(id: number): void {
    if (this.rows().length <= 1) {
      return;
    }

    const timer = this.candidateTimers.get(id);

    if (timer !== undefined) {
      clearTimeout(timer);
      this.candidateTimers.delete(id);
    }

    this.rows.update((rows) => rows.filter((row) => row.id !== id));
  }

  setRowName(id: number, event: Event): void {
    const name = (event.target as HTMLInputElement).value;

    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === id
          ? { ...row, name, productId: null, candidates: [] }
          : row,
      ),
    );

    const timer = this.candidateTimers.get(id);

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    if (name.trim().length < 2) {
      return;
    }

    this.candidateTimers.set(
      id,
      setTimeout(() => this.loadCandidates(id, name.trim()), CANDIDATES_DEBOUNCE_MS),
    );
  }

  chooseCandidate(rowId: number, event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    const row = this.rows().find((item) => item.id === rowId);
    const candidate = row?.candidates.find((item) => item.id === id);

    if (!candidate) {
      return;
    }

    this.rows.update((rows) =>
      rows.map((item) =>
        item.id === rowId
          ? {
              ...item,
              productId: candidate.id,
              name: candidate.name,
              price: candidate.price ?? item.price,
              candidates: [],
            }
          : item,
      ),
    );
  }

  setRowQty(id: number, event: Event): void {
    const qty = Number((event.target as HTMLInputElement).value);

    if (!Number.isFinite(qty) || qty < 0) {
      return;
    }

    this.rows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, qty } : row)),
    );
  }

  setRowPrice(id: number, event: Event): void {
    const price = Number((event.target as HTMLInputElement).value);

    if (!Number.isFinite(price) || price < 0) {
      return;
    }

    this.rows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, price } : row)),
    );
  }

  private loadCandidates(rowId: number, query: string): void {
    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === rowId ? { ...row, candidatesLoading: true } : row,
      ),
    );

    this.invoiceService
      .candidates(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (candidates) => {
          this.rows.update((rows) =>
            rows.map((row) =>
              row.id === rowId
                ? { ...row, candidates, candidatesLoading: false }
                : row,
            ),
          );
        },
        error: () => {
          this.rows.update((rows) =>
            rows.map((row) =>
              row.id === rowId ? { ...row, candidatesLoading: false } : row,
            ),
          );
        },
      });
  }
}
