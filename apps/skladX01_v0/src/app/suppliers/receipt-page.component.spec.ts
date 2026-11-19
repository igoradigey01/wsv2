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


  it('распознаёт накладную по фото и голосу и заполняет строки', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.imageFile.set(
      new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
        type: 'image/jpeg',
      }),
    );
    component.audioBlob.set(new Blob([new Uint8Array(100)], { type: 'audio/wav' }));
    component.recognize();

    httpMock.expectOne({ method: 'POST', url: '/api/recognition/parse' }).flush({
      document_number: '1042',
      document_date: '19.11.2026',
      supplier_name: 'ООО "СтройБаза"',
      general_comment: null,
      items: [
        {
          line_number: 1,
          article: null,
          name: 'Шайба цинк 10',
          unit: 'шт',
          price: 12.5,
          qty_doc: 10,
          qty_fact: 100,
          is_extra: false,
          item_comment: 'приняли сто штук',
        },
        {
          line_number: null,
          article: null,
          name: 'плёнка',
          unit: 'рулон',
          price: null,
          qty_doc: 0,
          qty_fact: 5,
          is_extra: true,
          item_comment: null,
        },
      ],
    });

    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(2);

    // Количество берём фактическое — то, что назвал приёмщик.
    expect(rows[0].name).toBe('Шайба цинк 10');
    expect(rows[0].qty).toBe(100);
    expect(rows[0].price).toBe(12.5);
    expect(rows[0].comment).toBe('приняли сто штук');

    expect(rows[1].extra).toBe(true);
    expect(rows[1].qty).toBe(5);
    expect(rows[1].price).toBe(0);

    expect(component.comment()).toBe('№ 1042 от 19.11.2026');

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('нет в накладной');
    expect(text).toContain('Распознано: 1042');
  });

  it('не добавляет строку из позиции без наименования', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.imageFile.set(
      new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
        type: 'image/jpeg',
      }),
    );
    component.audioBlob.set(new Blob([new Uint8Array(100)], { type: 'audio/wav' }));
    component.recognize();

    httpMock.expectOne({ method: 'POST', url: '/api/recognition/parse' }).flush({
      document_number: null,
      document_date: null,
      supplier_name: null,
      general_comment: null,
      items: [
        {
          line_number: 1,
          article: null,
          name: 'Шайба цинк 10',
          unit: 'шт',
          price: 12.5,
          qty_doc: 10,
          qty_fact: 10,
          is_extra: false,
          item_comment: null,
        },
        {
          line_number: null,
          article: null,
          name: '',
          unit: null,
          price: null,
          qty_doc: 1,
          qty_fact: 1,
          is_extra: false,
          item_comment: null,
        },
      ],
    });

    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe('Шайба цинк 10');
  });

  it('объясняет отказ 415 по формату файлов', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.imageFile.set(new File([new Uint8Array([1])], 'i.png', { type: 'image/png' }));
    component.audioBlob.set(new Blob([new Uint8Array(100)], { type: 'audio/wav' }));
    component.recognize();

    httpMock
      .expectOne({ method: 'POST', url: '/api/recognition/parse' })
      .flush({ error: 'нужен WAV' }, { status: 415, statusText: 'Unsupported Media Type' });

    expect(component.recognizeError()).toContain('WAV 16 кГц');
  });

  it('не отправляет запрос без фото или записи', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.recognize();

    httpMock.expectNone('/api/recognition/parse');
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
