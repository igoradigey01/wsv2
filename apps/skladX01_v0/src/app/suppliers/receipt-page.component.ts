import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { QuickCreateItemComponent } from '../nomenclature/quick-create-item.component';
import { NomenclatureService } from '../nomenclature/nomenclature.service';
import type { ICandidate, INomenclatureQuick } from '../nomenclature/nomenclature.service';
import { RecognitionService } from '../shared/recognition.service';
import type { IRecognizedDocument } from '../shared/recognition.models';
import { SpeechService } from '../shared/speech.service';
import { TabsComponent } from '../shared/tabs.component';
import { SupplierService } from './supplier.service';
import type { ISupplier, IWarehouse } from './supplier.models';

export interface IReceiptRow {
  id: number;
  productId: number | null;
  name: string;
  /** Артикул из накладной — пригодится при создании новой позиции. */
  article: string | null;
  unit: string | null;
  qty: number;
  price: number;
  /** Товар назван в голосе, но его нет в накладной. */
  extra: boolean;
  /** Расхождение или комментарий приёмщика по позиции. */
  comment: string | null;
  suggestions: INomenclatureQuick[];
  suggestionsLoading: boolean;
  suggestionsOpen: boolean;
  activeIndex: number;
  /** Векторные кандидаты для распознанной позиции. */
  candidates: ICandidate[];
  candidatesLoading: boolean;
}

/** Клавиатурный поиск: SQL LIKE, дебаунс на ввод. */
const QUICK_SEARCH_DEBOUNCE_MS = 200;

@Component({
  selector: 'app-receipt-page',
  imports: [DecimalPipe, NgTemplateOutlet, RouterModule, QuickCreateItemComponent, TabsComponent],
  templateUrl: './receipt-page.component.html',
  styleUrl: './receipt-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplierService = inject(SupplierService);
  private readonly nomenclatureService = inject(NomenclatureService);
  private readonly recognition = inject(RecognitionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpoints = inject(BreakpointObserver);
  readonly speech = inject(SpeechService);

  /** Узкий экран: блоки идут вкладками. */
  readonly isNarrow = toSignal(
    this.breakpoints
      .observe('(max-width: 767.98px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly supplierId = signal<number | null>(null);
  readonly supplier = signal<ISupplier | null>(null);
  readonly warehouses = signal<IWarehouse[]>([]);
  readonly warehouseId = signal<number | null>(null);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly date = signal(new Date().toISOString().slice(0, 10));
  readonly comment = signal('');

  readonly rows = signal<IReceiptRow[]>([this.createRow(1)]);
  private readonly lastRowId = signal(1);

  /** Распознавание по фото и тексту приёмщика. */
  readonly imageFile = signal<File | null>(null);
  readonly voiceText = signal('');
  readonly recognizingPhoto = signal(false);
  readonly recognizingText = signal(false);
  readonly recognizeError = signal<string | null>(null);
  readonly recognized = signal<IRecognizedDocument | null>(null);

  private readonly photoInput = viewChild<ElementRef<HTMLInputElement>>('photoInput');

  /** Строка, для которой открыта модалка быстрого создания. */
  readonly quickCreateRowId = signal<number | null>(null);
  readonly quickCreateName = signal('');
  readonly quickCreateArticle = signal('');
  readonly quickCreateUnit = signal('');
  readonly quickCreatePrice = signal<number | null>(null);

  private readonly searchTimers = new Map<number, ReturnType<typeof setTimeout>>();

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

  /** Фото накладной: камера телефона или файл. */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.imageFile.set(file);
      this.recognizeError.set(null);
    }
  }

  /** Текст приёмщика: что фактически приняли (необязательно). */
  setVoiceText(event: Event): void {
    this.voiceText.set((event.target as HTMLTextAreaElement).value);
  }

  /** Голосовой ввод: распознанный текст дописывается к уже введённому. */
  toggleSpeech(): void {
    this.speech.toggle((text) => {
      this.voiceText.update((current) =>
        current.trim().length > 0 ? `${current.trim()} ${text}` : text,
      );
    });
  }

  /** «Заполнить по тексту»: отправляет только текст приёмщика. */
  parseVoice(): void {
    const text = this.voiceText().trim();

    if (text.length === 0 || this.recognizingText()) {
      return;
    }

    this.sendByText(text);
  }

  /** «Распознать по фото»: отправляет только фото накладной. */
  recognizeByPhoto(): void {
    const image = this.imageFile();

    if (!image || this.recognizingPhoto()) {
      return;
    }

    this.sendByPhoto(image);
  }

  /** Очищает введённый текст и ошибку распознавания. */
  clearVoice(): void {
    if (this.recognizingText()) {
      return;
    }

    this.voiceText.set('');
    this.recognizeError.set(null);
  }

  /** Очищает выбранное фото и сбрасывает нативный input. */
  clearPhoto(): void {
    if (this.recognizingPhoto()) {
      return;
    }

    this.imageFile.set(null);
    this.recognizeError.set(null);

    const input = this.photoInput()?.nativeElement;

    if (input) {
      input.value = '';
    }
  }

  private sendByPhoto(image: File): void {
    this.recognizingPhoto.set(true);
    this.recognizeError.set(null);

    this.recognition
      .parse(image)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (document) => {
          this.recognizingPhoto.set(false);
          this.recognized.set(document);
          this.applyRecognized(document);
        },
        error: (error: { status?: number }) => {
          this.recognizingPhoto.set(false);
          this.recognizeError.set(this.describeError(error));
        },
      });
  }

  private sendByText(text: string): void {
    this.recognizingText.set(true);
    this.recognizeError.set(null);

    this.recognition
      .parse(text)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (document) => {
          this.recognizingText.set(false);
          this.recognized.set(document);
          this.applyRecognized(document);
        },
        error: (error: { status?: number }) => {
          this.recognizingText.set(false);
          this.recognizeError.set(this.describeError(error));
        },
      });
  }

  addRow(): void {
    const id = this.lastRowId() + 1;
    this.lastRowId.set(id);
    this.rows.update((rows) => [...rows, this.createRow(id)]);
  }

  removeRow(id: number): void {
    if (this.rows().length <= 1) {
      return;
    }

    this.clearTimer(id);
    this.rows.update((rows) => rows.filter((row) => row.id !== id));
  }

  /** Ввод в поле наименования — клавиатурный поиск (SQL LIKE), не вектор. */
  setRowName(id: number, event: Event): void {
    const name = (event.target as HTMLInputElement).value;

    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === id
          ? {
              ...row,
              name,
              productId: null,
              unit: null,
              suggestions: [],
              suggestionsOpen: name.trim().length >= 2,
              suggestionsLoading: name.trim().length >= 2,
              activeIndex: 0,
              candidates: [],
              candidatesLoading: false,
            }
          : row,
      ),
    );

    this.clearTimer(id);

    const query = name.trim();

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
          this.closeSuggestions(id);
        }
        break;
    }
  }

  chooseSuggestion(rowId: number, suggestion: INomenclatureQuick): void {
    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              productId: suggestion.id,
              name: suggestion.name,
              unit: suggestion.unit,
              price: suggestion.purchasePrice ?? row.price,
              suggestions: [],
              suggestionsOpen: false,
              suggestionsLoading: false,
              activeIndex: 0,
              candidates: [],
              candidatesLoading: false,
            }
          : row,
      ),
    );
  }

  /** Выбор товара из векторных кандидатов (цена из накладной не меняется). */
  chooseCandidate(rowId: number, event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const candidateId = raw === '' ? null : Number(raw);
    const row = this.rows().find((item) => item.id === rowId);
    const candidate = row?.candidates.find((item) => item.id === candidateId);

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
              candidates: [],
              candidatesLoading: false,
            }
          : item,
      ),
    );
  }

  openQuickCreate(rowId: number): void {
    const row = this.rows().find((item) => item.id === rowId);

    this.quickCreateName.set(row?.name ?? '');
    this.quickCreateArticle.set(row?.article ?? '');
    this.quickCreateUnit.set(row?.unit ?? '');
    this.quickCreatePrice.set(row && row.price > 0 ? row.price : null);
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

  /**
   * Переносит распознанные позиции в таблицу: количество берём фактическое
   * (его назвал приёмщик), а если он позицию не упоминал — по документу.
   */
  private applyRecognized(document: IRecognizedDocument): void {
    // Позиция без наименования — это не товар, а мусор распознавания:
    // такая строка выглядела бы пустой заготовкой с кол-вом 1 и ценой 0.
    const items = (document.items ?? []).filter(
      (item) => item.name.trim().length > 0,
    );

    if (items.length === 0) {
      this.recognizeError.set(
        'Позиции не распознаны. Попробуйте более чёткое фото накладной.',
      );
      return;
    }

    let nextId = this.lastRowId();

    const parsedRows: IReceiptRow[] = items.map((item) => ({
      ...this.createRow(++nextId),
      name: item.name,
      article: item.article,
      unit: item.unit,
      qty: item.qtyFact > 0 ? item.qtyFact : item.qtyDoc,
      price: item.price ?? 0,
      extra: item.extra,
      comment: item.comment,
    }));

    this.lastRowId.set(nextId);

    this.rows.update((rows) => [
      ...this.pruneEmptyRows(rows),
      ...parsedRows,
    ]);

    this.loadCandidatesForUnmatched(parsedRows);

    if (!this.comment().trim()) {
      const header = [
        document.number ? `№ ${document.number}` : '',
        document.date ? `от ${document.date}` : '',
      ]
        .filter((part) => part.length > 0)
        .join(' ');

      if (header) {
        this.comment.set(header);
      }
    }
  }

  private describeError(error: { status?: number }): string {
    switch (error.status) {
      case 415:
        return 'Сервер не принял файл: фото должно быть JPEG/PNG/WebP.';
      case 413:
        return 'Файл слишком большой: фото до 15 МБ.';
      case 502:
      case 504:
        return 'Модель не ответила. Проверьте Ollama на ks34.';
      default:
        return 'Не удалось распознать накладную. Проверьте, что SkladApi запущен на http://localhost:5240.';
    }
  }

  /** Строка-заготовка: товар не выбран и наименование не введено. */
  private isEmptyRow(row: IReceiptRow): boolean {
    return row.productId === null && row.name.trim().length === 0;
  }

  /** Убирает из таблицы пустые строки-заготовки. */
  private pruneEmptyRows(rows: IReceiptRow[]): IReceiptRow[] {
    return rows.filter((row) => !this.isEmptyRow(row));
  }

  private createRow(id: number): IReceiptRow {
    return {
      id,
      productId: null,
      name: '',
      article: null,
      unit: null,
      qty: 1,
      price: 0,
      extra: false,
      comment: null,
      suggestions: [],
      suggestionsLoading: false,
      suggestionsOpen: false,
      activeIndex: 0,
      candidates: [],
      candidatesLoading: false,
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

  private closeSuggestions(id: number): void {
    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === id ? { ...row, suggestionsOpen: false } : row,
      ),
    );
  }

  private clearTimer(id: number): void {
    const timer = this.searchTimers.get(id);

    if (timer !== undefined) {
      clearTimeout(timer);
      this.searchTimers.delete(id);
    }
  }

  /** Для распознанных строк, где товар ещё не выбран, подбираем векторных кандидатов. */
  private loadCandidatesForUnmatched(rows: IReceiptRow[]): void {
    for (const row of rows) {
      if (row.productId === null && row.name.trim().length > 0) {
        this.loadCandidates(row.id, row.name.trim());
      }
    }
  }

  private loadCandidates(rowId: number, query: string): void {
    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === rowId ? { ...row, candidatesLoading: true } : row,
      ),
    );

    this.nomenclatureService
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
