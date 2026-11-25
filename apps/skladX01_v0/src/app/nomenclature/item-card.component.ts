import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { NomenclatureAdminService } from './nomenclature-admin.service';
import type { IAdminItem } from './nomenclature-admin.service';

export interface INomenclatureCharacteristicRow {
  id: number;
  characteristicId: number | null;
  value: string;
}

export interface INomenclatureCard {
  code: string;
  article: string;
  name: string;
  shortName: string;
  groupId: number | null;
  typeId: number | null;
  unitId: number | null;
  country: string;
  photoUrl: string;
  purchasePrice: number;
  salePrice: number;
  wholesalePrice: number;
  minStock: number;
  maxStock: number;
  shelfLifeDays: number;
  description: string;
  active: boolean;
}

interface IReference {
  id: number;
  name: string;
}

const MOCK_GROUPS: IReference[] = [
  { id: 1, name: 'Стройматериалы' },
  { id: 2, name: 'Инструменты' },
  { id: 3, name: 'Расходные материалы' },
];

const MOCK_TYPES: IReference[] = [
  { id: 1, name: 'Товар' },
  { id: 2, name: 'Услуга' },
  { id: 3, name: 'Материал' },
];

const MOCK_UNITS: IReference[] = [
  { id: 1, name: 'шт' },
  { id: 2, name: 'кг' },
  { id: 3, name: 'л' },
  { id: 4, name: 'м' },
  { id: 5, name: 'м²' },
  { id: 6, name: 'м³' },
  { id: 7, name: 'т' },
];

const MOCK_CHARACTERISTICS: IReference[] = [
  { id: 1, name: 'Цвет' },
  { id: 2, name: 'Размер' },
  { id: 3, name: 'Материал' },
  { id: 4, name: 'Марка прочности' },
];

const MOCK_CARD: INomenclatureCard = {
  code: 'А-001',
  article: 'ЦМ-500',
  name: 'Цемент М500',
  shortName: 'Цемент',
  groupId: 1,
  typeId: 3,
  unitId: 2,
  country: 'Россия',
  photoUrl: '',
  purchasePrice: 380,
  salePrice: 450,
  wholesalePrice: 420,
  minStock: 100,
  maxStock: 2000,
  shelfLifeDays: 180,
  description: 'Портландцемент М500, фасовка 50 кг.',
  active: true,
};

type TTabKey = 'general' | 'pricing' | 'variants';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent implements OnInit {
  private readonly admin = inject(NomenclatureAdminService);
  private readonly router = inject(Router);

  readonly groups = MOCK_GROUPS;
  readonly types = MOCK_TYPES;
  readonly units = MOCK_UNITS;
  readonly characteristics = MOCK_CHARACTERISTICS;

  readonly item = signal<INomenclatureCard>(MOCK_CARD);
  readonly activeTab = signal<TTabKey>('general');
  readonly variants = signal<INomenclatureCharacteristicRow[]>([
    { id: 1, characteristicId: 4, value: 'М500' },
  ]);
  readonly notice = signal<string | null>(null);

  private nextVariantId = 2;

  readonly hasName = computed(() => this.item().name.trim().length > 0);

  ngOnInit(): void {
    const selected = this.admin.selectedItem();

    if (selected) {
      this.item.set(this.fromAdminItem(selected));
      this.notice.set(`Позиция: ${selected.code} — ${selected.name}`);
    }
  }

  /** Возврат к списку выбора позиции. */
  goBack(): void {
    this.router.navigate(['/admin/card']);
  }

  selectTab(tab: TTabKey): void {
    this.activeTab.set(tab);
  }

  onTextChange(field: 'code' | 'article' | 'name' | 'shortName' | 'country' | 'description', event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    this.setItem(field, target.value);
  }

  onNumberChange(
    field:
      | 'purchasePrice'
      | 'salePrice'
      | 'wholesalePrice'
      | 'minStock'
      | 'maxStock'
      | 'shelfLifeDays',
    event: Event,
  ): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;

    this.setItem(field, Number.isFinite(value) ? value : 0);
  }

  setSelect(
    field: 'groupId' | 'typeId' | 'unitId',
    event: Event,
  ): void {
    const raw = (event.target as HTMLSelectElement).value;

    this.setItem(field, raw === '' ? null : Number(raw));
  }

  onActiveChange(event: Event): void {
    this.setItem('active', (event.target as HTMLInputElement).checked);
  }

  save(): void {
    this.notice.set(
      'Демо-режим: данные не отправляются на сервер (POST номенклатуры в API нет).',
    );
  }

  cancel(): void {
    this.item.set({ ...MOCK_CARD });
    this.variants.set([{ id: 1, characteristicId: 4, value: 'М500' }]);
    this.notice.set('Изменения отменены.');
  }

  remove(): void {
    this.notice.set(
      'Демо-режим: удаление недоступно (DELETE номенклатуры в API нет).',
    );
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      this.item.update((card) => ({ ...card, photoUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  clearPhoto(): void {
    this.item.update((card) => ({ ...card, photoUrl: '' }));
  }

  addVariant(): void {
    const row = {
      id: this.nextVariantId++,
      characteristicId: null,
      value: '',
    };

    this.variants.update((rows) => [...rows, row]);
  }

  onVariantCharacteristic(rowId: number, event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;

    this.updateVariant(rowId, 'characteristicId', raw === '' ? null : Number(raw));
  }

  onVariantValue(rowId: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.updateVariant(rowId, 'value', value);
  }

  removeVariant(rowId: number): void {
    this.variants.update((rows) => rows.filter((row) => row.id !== rowId));
  }

  private fromAdminItem(item: IAdminItem): INomenclatureCard {
    return {
      ...MOCK_CARD,
      code: item.code,
      article: item.article,
      name: item.name,
      shortName: '',
      groupId: item.groupId,
      typeId: item.typeId,
      unitId: null,
      country: '',
      photoUrl: '',
      purchasePrice: item.purchasePrice ?? 0,
      salePrice: item.salePrice ?? 0,
      wholesalePrice: 0,
      minStock: 0,
      maxStock: 0,
      shelfLifeDays: 0,
      description: '',
      active: true,
    };
  }

  private setItem(field: keyof INomenclatureCard, value: unknown): void {
    this.item.update((card) => ({ ...card, [field]: value }));
  }

  private updateVariant(
    rowId: number,
    field: 'characteristicId' | 'value',
    value: number | null | string,
  ): void {
    this.variants.update((rows) =>
      rows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    );
  }
}
