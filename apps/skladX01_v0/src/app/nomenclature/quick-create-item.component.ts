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
} from './nomenclature.service';

const EMPTY_REFERENCES: INomenclatureReferences = {
  groups: [],
  kinds: [],
  categories: [],
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
  readonly categoryId = signal<number | null>(null);
  readonly typeId = signal(1);
  readonly kindId = signal<number | null>(null);
  readonly unitId = signal(0);
  readonly purchasePrice = signal<number | null>(null);
  readonly salePrice = signal<number | null>(null);

  ngOnInit(): void {
    this.name.set(this.initialName());

    this.nomenclatureService.getReferences().subscribe({
      next: (references) => {
        this.references.set(references);
        this.loading.set(false);
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
    field: 'groupId' | 'categoryId' | 'typeId' | 'unitId',
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

    if (kindId === null) {
      return;
    }

    this.nomenclatureService.getCharacteristics(kindId).subscribe({
      next: (rows) => this.characteristics.set(rows),
      error: () => this.error.set('Не удалось загрузить характеристики вида.'),
    });
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
        categoryId: this.categoryId(),
        typeId: this.typeId(),
        kindId: this.kindId(),
        unitId: this.unitId(),
        purchasePrice: this.purchasePrice(),
        salePrice: this.salePrice(),
        characteristics: this.characteristics().map((characteristic) => ({
          characteristicId: characteristic.id,
          value: this.values()[characteristic.id] ?? '',
        })),
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

  private setSignal(
    field: 'code' | 'article' | 'name' | 'shortName'
      | 'purchasePrice' | 'salePrice'
      | 'groupId' | 'categoryId' | 'typeId' | 'unitId',
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
      case 'categoryId':
        this.categoryId.set(value as number | null);
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
      const details = response.error?.details;

      if (Array.isArray(details) && details.length > 0) {
        return details.join(' ');
      }

      if (typeof response.error?.error === 'string') {
        return response.error.error;
      }
    }

    return 'Не удалось создать позицию. Проверьте данные.';
  }
}
