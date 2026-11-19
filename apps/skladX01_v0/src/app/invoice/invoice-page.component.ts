import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClientService } from '../clients/client.service';
import type { IClient, IMark } from '../clients/client.models';
import { QuickCreateItemComponent } from '../nomenclature/quick-create-item.component';
import { NomenclatureService } from '../nomenclature/nomenclature.service';
import type { INomenclatureQuick } from '../nomenclature/nomenclature.service';
import { InvoiceService } from './invoice.service';
import type { ICandidate } from './invoice.service';

export interface IInvoiceRow {
  id: number;
  productId: number | null;
  name: string;
  qty: number;
  unit: string | null;
  price: number;
  /** Голос: вектор + Левенштейн (только для распознанного текста). */
  candidates: ICandidate[];
  candidatesLoading: boolean;
  /** Клавиатура: SQL LIKE по коду/артикулу/названию. */
  suggestions: INomenclatureQuick[];
  suggestionsOpen: boolean;
  suggestionsLoading: boolean;
  activeIndex: number;
}

/** Клавиатурный поиск: SQL LIKE, дебаунс на ввод. */
const QUICK_SEARCH_DEBOUNCE_MS = 200;

@Component({
  selector: 'app-invoice-page',
  imports: [DecimalPipe, RouterModule, QuickCreateItemComponent],
  templateUrl: './invoice-page.component.html',
  styleUrl: './invoice-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly nomenclatureService = inject(NomenclatureService);
  private readonly destroyRef = inject(DestroyRef);

  readonly clientId = signal<number | null>(null);
  readonly client = signal<IClient | null>(null);
  readonly deal = signal<IMark | null>(null);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly date = signal(new Date().toISOString().slice(0, 10));
  readonly comment = signal('');
  readonly voiceText = signal('');

  readonly parsing = signal(false);
  readonly parseError = signal<string | null>(null);

  readonly rows = signal<IInvoiceRow[]>([this.createRow(1)]);
  private readonly lastRowId = signal(1);

  /** Строка, для которой открыта модалка быстрого создания. */
  readonly quickCreateRowId = signal<number | null>(null);
  readonly quickCreateName = signal('');

  private readonly searchTimers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly total = computed(() =>
    this.rows().reduce((sum, row) => sum + row.qty * row.price, 0),
  );

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    const clientId = Number(rawId);
    const dealId = this.route.snapshot.queryParamMap.get('dealId');

    if (!Number.isFinite(clientId)) {
      this.loading.set(false);
      this.error.set('Некорректный клиент.');
      return;
    }

    this.clientId.set(clientId);

    forkJoin({
      client: this.clientService.getClient(clientId),
      marks: this.clientService.getMarks(clientId),
    })
      .pipe(
        map(({ client, marks }) => ({
          client,
          deal: dealId ? marks.find((mark) => mark.id === dealId) ?? null : null,
        })),
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
          this.client.set(result.client);
          this.deal.set(result.deal);
        }
      });
  }

  @HostListener('document:click', ['$event.target'])
  closeListsOnOutsideClick(target: EventTarget | null): void {
    const element = target as HTMLElement | null;

    if (element?.closest('[data-suggest]')) {
      return;
    }

    this.rows.update((rows) =>
      rows.map((row) =>
        row.suggestionsOpen ? { ...row, suggestionsOpen: false } : row,
      ),
    );
  }

  parseVoice(): void {
    const text = this.voiceText().trim();

    if (text.length === 0 || this.parsing()) {
      return;
    }

    this.parsing.set(true);
    this.parseError.set(null);

    this.invoiceService
      .parseVoice(text)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (parsed) => {
          this.parsing.set(false);

          if (parsed.length === 0) {
            this.parseError.set('В тексте не нашлось ни одной позиции.');
            return;
          }

          let nextId = this.lastRowId();
          // Распознанные позиции дописываются к накладной, а не заменяют её.
          // Пустые позиции из ответа модели (name === '') отбрасываем: иначе
          // в конце таблицы появляется строка-заготовка с кол-вом 1 и ценой 0.
          const parsedRows = parsed
            .filter((row) => row.name.trim().length > 0)
            .map((row) => ({
              ...this.createRow(++nextId),
              productId: row.productId,
              name: row.name,
              qty: row.qty,
              unit: row.unit,
              price: 0,
            }));

          if (parsedRows.length === 0) {
            this.parseError.set('В тексте не нашлось ни одной позиции.');
            return;
          }

          this.rows.update((rows) => [
            // Пустые заготовки строк не нужны — сохраняем только заполненные.
            ...this.pruneEmptyRows(rows),
            ...parsedRows,
          ]);
          this.lastRowId.set(nextId);
          this.loadCandidatesForUnmatched(parsedRows);
        },
        error: () => {
          this.parsing.set(false);
          this.parseError.set(
            'Сервис распознавания недоступен. Проверьте Ollama на ks34 и SQL Server.',
          );
        },
      });
  }

  addRow(): void {
    const id = this.lastRowId() + 1;
    this.lastRowId.set(id);
    this.rows.update((rows) => [...rows, this.createRow(id)]);
  }

  /** Голос: выбор из векторных кандидатов. */
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
              suggestions: [],
              suggestionsOpen: false,
            }
          : item,
      ),
    );
  }

  /** Клавиатура: выбор из быстрого SQL-поиска. */
  chooseSuggestion(rowId: number, suggestion: INomenclatureQuick): void {
    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              productId: suggestion.id,
              name: suggestion.name,
              unit: suggestion.unit,
              price: suggestion.salePrice ?? row.price,
              candidates: [],
              suggestions: [],
              suggestionsOpen: false,
              suggestionsLoading: false,
              activeIndex: 0,
            }
          : row,
      ),
    );
  }

  openQuickCreate(rowId: number): void {
    const row = this.rows().find((item) => item.id === rowId);

    this.quickCreateName.set(row?.name ?? '');
    this.quickCreateRowId.set(rowId);
  }

  onQuickCreated(item: INomenclatureQuick): void {
    const rowId = this.quickCreateRowId();

    this.quickCreateRowId.set(null);

    if (rowId === null) {
      return;
    }

    this.chooseSuggestion(rowId, item);
  }

  closeQuickCreate(): void {
    this.quickCreateRowId.set(null);
  }

  onRowKeydown(id: number, event: KeyboardEvent): void {
    const row = this.rows().find((item) => item.id === id);

    if (!row) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        if (row.suggestions.length === 0) {
          return;
        }
        event.preventDefault();
        this.moveActive(id, 1);
        break;
      case 'ArrowUp':
        if (row.suggestions.length === 0) {
          return;
        }
        event.preventDefault();
        this.moveActive(id, -1);
        break;
      case 'Enter':
        if (!row.suggestionsOpen || row.suggestions.length === 0) {
          return;
        }
        event.preventDefault();
        this.chooseSuggestion(id, row.suggestions[row.activeIndex]);
        break;
      case 'Escape':
        if (row.suggestionsOpen) {
          event.stopPropagation();
          this.rows.update((rows) =>
            rows.map((item) =>
              item.id === id ? { ...item, suggestionsOpen: false } : item,
            ),
          );
        }
        break;
    }
  }

  private loadCandidatesForUnmatched(rows: IInvoiceRow[]): void {
    for (const row of rows) {
      if (row.productId === null && row.name.trim().length > 0) {
        this.loadCandidates(row.id, row.name);
      }
    }
  }

  private loadCandidates(rowId: number, query: string): void {
    this.rows.update((rows) =>
      rows.map((row) => (row.id === rowId ? { ...row, candidatesLoading: true } : row)),
    );

    this.invoiceService
      .candidates(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (candidates) => {
          this.rows.update((rows) =>
            rows.map((row) =>
              row.id === rowId ? { ...row, candidates, candidatesLoading: false } : row,
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

  removeRow(id: number): void {
    if (this.rows().length <= 1) {
      return;
    }

    this.clearTimer(id);
    this.rows.update((rows) => rows.filter((row) => row.id !== id));
  }

  setDate(event: Event): void {
    this.date.set((event.target as HTMLInputElement).value);
  }

  setComment(event: Event): void {
    this.comment.set((event.target as HTMLTextAreaElement).value);
  }

  setVoiceText(event: Event): void {
    this.voiceText.set((event.target as HTMLTextAreaElement).value);
  }

  clearVoice(): void {
    if (this.parsing()) {
      return;
    }

    this.voiceText.set('');
    this.parseError.set(null);
  }

  /** Ввод с клавиатуры — быстрый SQL-поиск (не вектор и не Ollama). */
  setRowName(id: number, event: Event): void {
    const name = (event.target as HTMLInputElement).value;
    const query = name.trim();

    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === id
          ? {
              ...row,
              name,
              productId: null,
              suggestions: [],
              suggestionsOpen: query.length >= 2,
              suggestionsLoading: query.length >= 2,
              activeIndex: 0,
            }
          : row,
      ),
    );

    this.clearTimer(id);

    if (query.length < 2) {
      this.rows.update((rows) =>
        rows.map((row) =>
          row.id === id ? { ...row, suggestions: [], suggestionsLoading: false } : row,
        ),
      );
      return;
    }

    this.searchTimers.set(
      id,
      setTimeout(() => this.loadSuggestions(id, query), QUICK_SEARCH_DEBOUNCE_MS),
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

  /** Строка-заготовка: товар не выбран и наименование не введено. */
  private isEmptyRow(row: IInvoiceRow): boolean {
    return row.productId === null && row.name.trim().length === 0;
  }

  /** Убирает из таблицы пустые строки-заготовки. */
  private pruneEmptyRows(rows: IInvoiceRow[]): IInvoiceRow[] {
    return rows.filter((row) => !this.isEmptyRow(row));
  }

  private createRow(id: number): IInvoiceRow {
    return {
      id,
      productId: null,
      name: '',
      qty: 1,
      unit: null,
      price: 0,
      candidates: [],
      candidatesLoading: false,
      suggestions: [],
      suggestionsOpen: false,
      suggestionsLoading: false,
      activeIndex: 0,
    };
  }

  private moveActive(id: number, delta: number): void {
    this.rows.update((rows) =>
      rows.map((row) => {
        if (row.id !== id || row.suggestions.length === 0) {
          return row;
        }

        const count = row.suggestions.length;
        const activeIndex = (row.activeIndex + delta + count) % count;

        return { ...row, activeIndex, suggestionsOpen: true };
      }),
    );
  }

  private clearTimer(id: number): void {
    const timer = this.searchTimers.get(id);

    if (timer !== undefined) {
      clearTimeout(timer);
      this.searchTimers.delete(id);
    }
  }

  private loadSuggestions(rowId: number, query: string): void {
    this.nomenclatureService
      .quickSearch(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (suggestions) => {
          this.rows.update((rows) =>
            rows.map((row) =>
              row.id === rowId
                ? {
                    ...row,
                    suggestions,
                    suggestionsLoading: false,
                    activeIndex: 0,
                  }
                : row,
            ),
          );
        },
        error: () => {
          this.rows.update((rows) =>
            rows.map((row) =>
              row.id === rowId
                ? { ...row, suggestions: [], suggestionsLoading: false }
                : row,
            ),
          );
        },
      });
  }
}
