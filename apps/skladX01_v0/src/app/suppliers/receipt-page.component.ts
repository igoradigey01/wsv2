import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { QuickCreateItemComponent } from '../nomenclature/quick-create-item.component';
import { NomenclatureService } from '../nomenclature/nomenclature.service';
import type { INomenclatureQuick } from '../nomenclature/nomenclature.service';
import { RecognitionService } from '../shared/recognition.service';
import type { IRecognizedDocument } from '../shared/recognition.models';
import { WavRecorder } from '../shared/wav-recorder';
import { SupplierService } from './supplier.service';
import type { ISupplier, IWarehouse } from './supplier.models';

export interface IReceiptRow {
  id: number;
  productId: number | null;
  name: string;
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
}

/** Клавиатурный поиск: SQL LIKE, дебаунс на ввод. */
const QUICK_SEARCH_DEBOUNCE_MS = 200;

@Component({
  selector: 'app-receipt-page',
  imports: [DecimalPipe, RouterModule, QuickCreateItemComponent],
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

  private readonly recorder = new WavRecorder();
  private recordTimer: ReturnType<typeof setInterval> | undefined;

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

  /** Распознавание по фото и голосу. */
  readonly imageFile = signal<File | null>(null);
  readonly audioBlob = signal<Blob | null>(null);
  readonly recording = signal(false);
  readonly recordSeconds = signal(0);
  readonly recognizing = signal(false);
  readonly recognizeError = signal<string | null>(null);
  readonly recognized = signal<IRecognizedDocument | null>(null);

  /** Строка, для которой открыта модалка быстрого создания. */
  readonly quickCreateRowId = signal<number | null>(null);
  readonly quickCreateName = signal('');

  private readonly searchTimers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly total = computed(() =>
    this.rows().reduce((sum, row) => sum + row.qty * row.price, 0),
  );

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      if (this.recordTimer !== undefined) {
        clearInterval(this.recordTimer);
      }

      void this.recorder.cancel();
    });

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

  /** Старт/стоп записи голоса приёмщика. */
  async toggleRecording(): Promise<void> {
    if (this.recording()) {
      await this.stopRecording();
      return;
    }

    this.recognizeError.set(null);

    try {
      await this.recorder.start();
      this.recording.set(true);
      this.recordSeconds.set(0);
      this.recordTimer = setInterval(
        () => this.recordSeconds.update((value) => value + 1),
        1000,
      );
    } catch (error) {
      this.recording.set(false);
      this.recognizeError.set(
        error instanceof Error
          ? error.message
          : 'Не удалось включить микрофон.',
      );
    }
  }

  /** Отправляет фото и запись в SkladApi. */
  recognize(): void {
    const image = this.imageFile();
    const audio = this.audioBlob();

    if (!image || !audio || this.recognizing()) {
      return;
    }

    this.recognizing.set(true);
    this.recognizeError.set(null);

    this.recognition
      .parse(image, audio)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (document) => {
          this.recognizing.set(false);
          this.recognized.set(document);
          this.applyRecognized(document);
        },
        error: (error: { status?: number }) => {
          this.recognizing.set(false);
          this.recognizeError.set(this.describeError(error));
        },
      });
  }

  formatSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);

    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
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

  private async stopRecording(): Promise<void> {
    if (this.recordTimer !== undefined) {
      clearInterval(this.recordTimer);
      this.recordTimer = undefined;
    }

    this.recording.set(false);

    const blob = await this.recorder.stop();

    // Пустой WAV — это только заголовок в 44 байта.
    if (blob.size > 44) {
      this.audioBlob.set(blob);
      return;
    }

    this.recognizeError.set('Запись пустая — запишите комментарий ещё раз.');
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
        return 'Сервер не принял файл: фото — JPEG/PNG/WebP, аудио — WAV 16 кГц, моно.';
      case 503:
        return 'На сервере нет модели Whisper (Models/ggml-base.bin).';
      case 502:
      case 504:
        return 'Модель не ответила. Проверьте Ollama на ks34.';
      case 413:
        return 'Файл слишком большой: фото до 15 МБ, аудио до 10 МБ.';
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
      unit: null,
      qty: 1,
      price: 0,
      extra: false,
      comment: null,
      suggestions: [],
      suggestionsLoading: false,
      suggestionsOpen: false,
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
