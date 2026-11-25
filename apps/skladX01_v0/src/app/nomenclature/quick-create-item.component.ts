import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NomenclatureService } from './nomenclature.service';
import type {
  ICharacteristic,
  INomenclatureQuick,
  INomenclatureReferences,
  IReference,
} from './nomenclature.service';
import { resolveUnitId } from './unit-matcher';

const EMPTY_REFERENCES: INomenclatureReferences = {
  groups: [],
  kinds: [],
  types: [],
  units: [],
};

@Component({
  selector: 'app-quick-create-item',
  templateUrl: './quick-create-item.component.html',
  styleUrl: './quick-create-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickCreateItemComponent implements OnInit {
  private readonly nomenclatureService = inject(NomenclatureService);

  readonly initialName = input('');
  readonly initialArticle = input('');
  readonly initialUnit = input('');
  readonly initialPurchasePrice = input<number | null>(null);
  readonly created = output<INomenclatureQuick>();
  readonly closed = output<void>();

  readonly references = signal<INomenclatureReferences>(EMPTY_REFERENCES);
  readonly characteristics = signal<ICharacteristic[]>([]);
  readonly values = signal<Record<number, string>>({});

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly code = signal('');
  readonly article = signal('');
  readonly name = signal('');
  readonly shortName = signal('');
  readonly groupId = signal<number | null>(null);
  readonly typeId = signal(1);
  readonly kindId = signal<number | null>(null);
  readonly unitId = signal(0);
  readonly purchasePrice = signal<number | null>(null);
  readonly salePrice = signal<number | null>(null);

  ngOnInit(): void {
    this.name.set(this.initialName());
    this.article.set(this.initialArticle());
    this.purchasePrice.set(this.initialPurchasePrice());

    // Код подбираем на сервере; если не получилось — человек введёт вручную.
    this.nomenclatureService.nextCode().subscribe({
      next: (code) => {
        if (this.code().trim().length === 0) {
          this.code.set(code);
        }
      },
      error: () => {
        // Поле кода остаётся пустым — его можно заполнить вручную.
      },
    });

    this.nomenclatureService.getReferences().subscribe({
      next: (references) => {
        this.references.set(references);
        this.loading.set(false);

        this.unitId.set(resolveUnitId(this.initialUnit(), references.units) ?? 0);

        const kindId = this.detectKindId(this.name(), references.kinds);

        if (kindId !== null) {
          this.kindId.set(kindId);
          this.loadCharacteristics(kindId);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Не удалось загрузить справочники. Проверьте SkladApi.');
      },
    });
  }

  setText(
    field: 'code' | 'article' | 'name' | 'shortName',
    event: Event,
  ): void {
    this.setSignal(field, (event.target as HTMLInputElement).value);
  }

  setNumber(
    field: 'purchasePrice' | 'salePrice',
    event: Event,
  ): void {
    const raw = (event.target as HTMLInputElement).value;
    const value = raw === '' ? null : Number(raw);

    this.setSignal(field, value !== null && Number.isFinite(value) ? value : null);
  }

  setSelect(
    field: 'groupId' | 'typeId' | 'unitId',
    event: Event,
  ): void {
    const raw = (event.target as HTMLSelectElement).value;
    const value = Number(raw);

    this.setSignal(field, Number.isFinite(value) ? value : field === 'unitId' ? 0 : null);
  }

  setKind(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const kindId = raw === '' ? null : Number(raw);

    this.kindId.set(kindId);
    this.values.set({});
    this.characteristics.set([]);

    if (kindId !== null) {
      this.loadCharacteristics(kindId);
    }
  }

  setCharacteristicValue(characteristicId: number, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;

    this.values.update((values) => ({ ...values, [characteristicId]: value }));
  }

  save(): void {
    if (this.saving()) {
      return;
    }

    if (this.name().trim().length === 0) {
      this.error.set('Наименование обязательно.');
      return;
    }

    if (this.code().trim().length === 0) {
      this.error.set('Код обязателен.');
      return;
    }

    if (this.unitId() <= 0) {
      this.error.set('Выберите базовую единицу измерения.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.nomenclatureService
      .create({
        code: this.code().trim(),
        article: this.article().trim(),
        name: this.name().trim(),
        shortName: this.shortName().trim(),
        groupId: this.groupId(),
        typeId: this.typeId(),
        kindId: this.kindId(),
        unitId: this.unitId(),
        purchasePrice: this.purchasePrice(),
        salePrice: this.salePrice(),
        // Пустые значения не отправляем: «— не выбрано —» значит «не задано»,
        // и тогда на сервере действует значение по умолчанию вида.
        characteristics: this.characteristics()
          .map((characteristic) => ({
            characteristicId: characteristic.id,
            value: (this.values()[characteristic.id] ?? '').trim(),
          }))
          .filter((item) => item.value.length > 0),
      })
      .subscribe({
        next: (result) => {
          this.saving.set(false);

          const unit = this.references().units.find(
            (item) => item.id === this.unitId(),
          );

          this.created.emit({
            id: result.id,
            code: result.code,
            article: this.article().trim(),
            name: result.name,
            unit: unit?.name ?? '',
            purchasePrice: this.purchasePrice(),
            salePrice: this.salePrice(),
          });
        },
        error: (response: unknown) => {
          this.saving.set(false);
          this.error.set(this.describeError(response));
        },
      });
  }

  close(): void {
    if (!this.saving()) {
      this.closed.emit();
    }
  }

  private loadCharacteristics(kindId: number): void {
    this.nomenclatureService.getCharacteristics(kindId).subscribe({
      next: (rows) => this.characteristics.set(rows),
      error: () => this.error.set('Не удалось загрузить характеристики вида.'),
    });
  }

  /** Вид определяется по началу названия: «шайба цинк 10» → вид «шайба». */
  private detectKindId(name: string, kinds: IReference[]): number | null {
    const normalized = name.trim().toLocaleLowerCase('ru');

    if (normalized.length === 0) {
      return null;
    }

    const match = kinds
      .map((kind) => ({
        id: kind.id,
        name: kind.name.trim().toLocaleLowerCase('ru'),
      }))
      .filter((kind) => kind.name.length > 0 && normalized.startsWith(kind.name))
      .sort((left, right) => right.name.length - left.name.length)[0];

    return match?.id ?? null;
  }

  private setSignal(
    field: 'code' | 'article' | 'name' | 'shortName'
      | 'purchasePrice' | 'salePrice'
      | 'groupId' | 'typeId' | 'unitId',
    value: string | number | null,
  ): void {
    switch (field) {
      case 'code':
        this.code.set(String(value ?? ''));
        break;
      case 'article':
        this.article.set(String(value ?? ''));
        break;
      case 'name':
        this.name.set(String(value ?? ''));
        break;
      case 'shortName':
        this.shortName.set(String(value ?? ''));
        break;
      case 'purchasePrice':
        this.purchasePrice.set(value as number | null);
        break;
      case 'salePrice':
        this.salePrice.set(value as number | null);
        break;
      case 'groupId':
        this.groupId.set(value as number | null);
        break;
      case 'typeId':
        this.typeId.set(Number(value ?? 1));
        break;
      case 'unitId':
        this.unitId.set(Number(value ?? 0));
        break;
    }
  }

  private describeError(response: unknown): string {
    if (response instanceof HttpErrorResponse) {
      const body: unknown = response.error;
      const details = this.readDetails(body);

      if (details.length > 0) {
        return details.join(' ');
      }

      const message = this.readMessage(body);

      if (message !== null) {
        return message;
      }

      if (response.status === 0) {
        return 'Нет связи с SkladApi. Проверьте, запущен ли сервер.';
      }

      return `Не удалось создать позицию (HTTP ${response.status}). Проверьте данные.`;
    }

    return 'Не удалось создать позицию. Проверьте данные.';
  }

  /** 400 от API: { error: string, details: string[] }. */
  private readDetails(body: unknown): string[] {
    if (this.isRecord(body)) {
      const details = body['details'];

      if (Array.isArray(details)) {
        return details.filter(
          (item): item is string => typeof item === 'string' && item.trim().length > 0,
        );
      }
    }

    return [];
  }

  /** ProblemDetails (title/detail) и текстовые тела тоже нужно показать. */
  private readMessage(body: unknown): string | null {
    if (typeof body === 'string') {
      const text = body.trim();

      return text.length > 0 ? text.slice(0, 300) : null;
    }

    if (this.isRecord(body)) {
      for (const key of ['error', 'detail', 'title', 'message']) {
        const value = body[key];

        if (typeof value === 'string' && value.trim().length > 0) {
          return value.trim();
        }
      }
    }

    return null;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
