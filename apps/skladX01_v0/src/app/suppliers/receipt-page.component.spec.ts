import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';

import { ReceiptPageComponent } from './receipt-page.component';

const SUPPLIER = {
  id: 1,
  название: 'Смоленск',
  город: 'Смоленск',
  телефон: null,
};

const WAREHOUSES = [
  { id: 1, название: 'Основной', псевдоним: 'осн' },
  { id: 2, название: 'Ангар', псевдоним: 'анг' },
];

describe('ReceiptPageComponent', () => {
  let fixture: ComponentFixture<ReceiptPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptPageComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  function flushHeader(): void {
    httpMock.expectOne('/api/suppliers/1').flush(SUPPLIER);
    httpMock.expectOne('/api/warehouses').flush(WAREHOUSES);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('показывает поставщика и склады', () => {
    flushHeader();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Приход товара');
    expect(text).toContain('Смоленск');
    expect(fixture.componentInstance.warehouses().length).toBe(2);
    expect(fixture.componentInstance.warehouseId()).toBe(1);
  });

  it('считает итог и добавляет/удаляет строки', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.setRowQty(1, { target: { value: '3' } } as unknown as Event);
    component.setRowPrice(1, { target: { value: '100' } } as unknown as Event);
    fixture.detectChanges();

    expect(component.total()).toBe(300);

    component.addRow();
    fixture.detectChanges();
    expect(component.rows().length).toBe(2);

    component.removeRow(component.rows()[1].id);
    fixture.detectChanges();
    expect(component.rows().length).toBe(1);
  });

  it('ищет номенклатуру с клавиатуры и подставляет цену', () => {
    flushHeader();

    const component = fixture.componentInstance;

    jest.useFakeTimers();
    component.setRowName(1, {
      target: { value: 'Цемент' },
    } as unknown as Event);
    fixture.detectChanges();

    jest.advanceTimersByTime(200);
    jest.useRealTimers();

    const quickRequest = httpMock.expectOne(
      (request) => request.url === '/api/nomenclature/quick-search',
    );
    expect(quickRequest.request.params.get('q')).toBe('Цемент');
    quickRequest.flush([
      {
        id: 5,
        код: 'НМ-00005',
        артикул: 'CEM500',
        название: 'Цемент М500',
        едИзм: 'кг',
        ценаЗакупочная: 450,
        ценаПродажная: 600,
      },
    ]);

    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll(
      '.suggest__table tbody tr',
    ) as NodeListOf<HTMLElement>;
    expect(rows.length).toBe(1);

    rows[0].click();
    fixture.detectChanges();

    const row = component.rows()[0];
    expect(row.productId).toBe(5);
    expect(row.name).toBe('Цемент М500');
    expect(row.unit).toBe('кг');
    expect(row.price).toBe(450);
    expect(row.suggestionsOpen).toBe(false);
  });

  it('выбирает первую подсказку по Enter', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.rows.update((rows) =>
      rows.map((row) =>
        row.id === 1
          ? {
              ...row,
              suggestionsOpen: true,
              suggestions: [
                {
                  id: 9,
                  code: 'НМ-00009',
                  article: '',
                  name: 'Песок',
                  unit: 'т',
                  purchasePrice: 300,
                  salePrice: 400,
                },
              ],
            }
          : row,
      ),
    );
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'tbody input[type="text"]',
    ) as HTMLInputElement;

    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();

    const row = component.rows()[0];
    expect(row.productId).toBe(9);
    expect(row.unit).toBe('т');
    expect(row.price).toBe(300);
  });

  it('открывает модалку быстрого создания из строки «Создать новую»', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.rows.update((rows) =>
      rows.map((row) =>
        row.id === 1 ? { ...row, name: 'Несуществующая позиция' } : row,
      ),
    );
    component.openQuickCreate(1);
    fixture.detectChanges();

    expect(component.quickCreateRowId()).toBe(1);
    expect(component.quickCreateName()).toBe('Несуществующая позиция');

    httpMock.expectOne('/api/nomenclature/references').flush({
      группы: [],
      виды: [],
      категории: [],
      единицы: [{ id: 3, название: 'шт' }],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-quick-create-item')).toBeTruthy();
  });
});
