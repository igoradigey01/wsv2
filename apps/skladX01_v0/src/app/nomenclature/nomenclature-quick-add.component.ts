import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  signal,
  viewChild,
} from '@angular/core';

export interface INomenclatureItem {
  id: number;
  code: string;
  barcode: string;
  name: string;
  unit: string;
  stock: number;
  price: number;
}

/** Мок-данные вместо GET /api/nomenclature — остатков в API пока нет. */
const MOCK_ITEMS: INomenclatureItem[] = [
  {
    id: 1,
    code: 'А-001',
    barcode: '2000000000015',
    name: 'Цемент М500',
    unit: 'кг',
    stock: 1500,
    price: 450,
  },
  {
    id: 2,
    code: 'Б-002',
    barcode: '2000000000022',
    name: 'Кирпич красный',
    unit: 'шт',
    stock: 20000,
    price: 12,
  },
  {
    id: 3,
    code: 'В-003',
    barcode: '2000000000039',
    name: 'Песок сухой',
    unit: 'т',
    stock: 50,
    price: 1200,
  },
  {
    id: 4,
    code: 'Г-004',
    barcode: '2000000000046',
    name: 'Доска обрезная 40×100',
    unit: 'м³',
    stock: 120,
    price: 9800,
  },
  {
    id: 5,
    code: 'Д-005',
    barcode: '2000000000053',
    name: 'Гвозди 90 мм',
    unit: 'кг',
    stock: 400,
    price: 210,
  },
  {
    id: 6,
    code: 'Е-006',
    barcode: '2000000000060',
    name: 'Шуруповёрт Makita',
    unit: 'шт',
    stock: 15,
    price: 7900,
  },
  {
    id: 7,
    code: 'Ж-007',
    barcode: '2000000000077',
    name: 'Краска фасадная белая',
    unit: 'л',
    stock: 300,
    price: 480,
  },
  {
    id: 8,
    code: 'З-008',
    barcode: '2000000000084',
    name: 'Утеплитель Rockwool',
    unit: 'м²',
    stock: 800,
    price: 650,
  },
  {
    id: 9,
    code: 'И-009',
    barcode: '2000000000091',
    name: 'Проволока вязальная',
    unit: 'кг',
    stock: 250,
    price: 150,
  },
];

const MAX_RESULTS = 8;

@Component({
  selector: 'app-nomenclature-quick-add',
  imports: [DecimalPipe],
  templateUrl: './nomenclature-quick-add.component.html',
  styleUrl: './nomenclature-quick-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NomenclatureQuickAddComponent implements AfterViewInit {
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>(
    'searchInput',
  );

  readonly query = signal('');
  readonly items = signal<INomenclatureItem[]>(MOCK_ITEMS);
  readonly selectedItem = signal<INomenclatureItem | null>(null);
  readonly qty = signal(1);
  readonly price = signal(0);
  readonly lastAdded = signal<string | null>(null);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();

    if (q.length === 0) {
      return [];
    }

    return this.items()
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.barcode.includes(q),
      )
      .slice(0, MAX_RESULTS);
  });

  readonly total = computed(() => {
    const value = this.qty() * this.price();

    return Number.isFinite(value) ? value : 0;
  });

  readonly canAdd = computed(
    () => this.selectedItem() !== null && this.qty() > 0,
  );

  ngAfterViewInit(): void {
    this.searchInput()?.nativeElement.focus();
  }

  onQueryChange(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.lastAdded.set(null);
  }

  selectFirst(): void {
    const first = this.filtered()[0];

    if (first) {
      this.select(first);
    }
  }

  select(item: INomenclatureItem): void {
    this.selectedItem.set(item);
    this.query.set('');
    this.qty.set(1);
    this.price.set(item.price);
    this.lastAdded.set(null);
  }

  onQtyChange(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;

    this.qty.set(Number.isFinite(value) ? value : 0);
  }

  onPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;

    this.price.set(Number.isFinite(value) ? value : 0);
  }

  addToInvoice(): void {
    const item = this.selectedItem();

    if (!item || this.qty() < 1) {
      return;
    }

    this.lastAdded.set(`${item.name} × ${this.qty()} ${item.unit}`);
    this.selectedItem.set(null);
    this.price.set(0);
    this.qty.set(1);

    this.searchInput()?.nativeElement.focus();
  }
}
