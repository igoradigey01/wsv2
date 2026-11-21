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

  /** На десктопе голос и фото живут во вкладках: открываем нужную. */
  function openTab(label: string): void {
    const tabs = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.tabs__tab',
      ) as NodeListOf<HTMLButtonElement>,
    );
    const tab = tabs.find((button) => button.textContent?.trim() === label);

    expect(tab).toBeTruthy();
    tab?.click();
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


  it('распознаёт накладную по фото и заполняет строки', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.imageFile.set(
      new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
        type: 'image/jpeg',
      }),
    );
    component.recognizeByPhoto();

    const request = httpMock.expectOne({
      method: 'POST',
      url: '/api/recognition/parse',
    });
    const body = request.request.body as FormData;
    expect(body.get('image')).toBeTruthy();
    expect(body.get('text')).toBeNull();
    expect(body.get('audio')).toBeNull();

    request.flush({
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

    // Для каждой распознанной строки страница запрашивает векторных кандидатов.
    const candidates = httpMock.match(
      (candidate) => candidate.url === '/api/nomenclature/candidates',
    );
    expect(candidates.length).toBe(2);
    expect(candidates[0].request.params.get('q')).toBe('Шайба цинк 10');
    candidates[0].flush([
      { id: 141, name: 'Шайба Цинк_10', price: 280, score: 99.2 },
    ]);
    candidates[1].flush([]);

    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(2);

    // Количество берём фактическое — то, что назвал приёмщик.
    expect(rows[0].name).toBe('Шайба цинк 10');
    expect(rows[0].qty).toBe(100);
    expect(rows[0].price).toBe(12.5);
    expect(rows[0].comment).toBe('приняли сто штук');
    expect(rows[0].candidates.length).toBe(1);

    expect(rows[1].extra).toBe(true);
    expect(rows[1].qty).toBe(5);
    expect(rows[1].price).toBe(0);
    expect(rows[1].candidates.length).toBe(0);

    expect(component.comment()).toBe('№ 1042 от 19.11.2026');

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('нет в накладной');
    expect(text).toContain('Создать новую');

    // Итог распознавания показан в блоке фото, а он открыт вкладкой.
    openTab('Фото накладной');
    expect(fixture.nativeElement.textContent as string).toContain(
      'Распознано: 1042',
    );
  });

  it('подставляет товар из векторного кандидата, не меняя цену документа', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.rows.update((rows) =>
      rows.map((row) =>
        row.id === 1
          ? {
              ...row,
              name: 'шайба цинк 10',
              price: 12.5,
              candidates: [
                { id: 141, name: 'Шайба Цинк_10', price: 280, score: 99.2 },
              ],
            }
          : row,
      ),
    );
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select.candidates',
    ) as HTMLSelectElement;
    expect(select).toBeTruthy();

    select.value = '141';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const row = component.rows()[0];
    expect(row.productId).toBe(141);
    expect(row.name).toBe('Шайба Цинк_10');
    expect(row.price).toBe(12.5);
    expect(row.candidates.length).toBe(0);
  });

  it('не добавляет строку из позиции без наименования', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.imageFile.set(
      new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
        type: 'image/jpeg',
      }),
    );
    component.recognizeByPhoto();

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

    httpMock
      .match((request) => request.url === '/api/nomenclature/candidates')
      .forEach((request) => request.flush([]));

    const rows = component.rows();
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe('Шайба цинк 10');
  });

  it('объясняет отказ 415 по формату фото', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.imageFile.set(new File([new Uint8Array([1])], 'i.png', { type: 'image/png' }));
    component.recognizeByPhoto();

    httpMock
      .expectOne({ method: 'POST', url: '/api/recognition/parse' })
      .flush({ error: 'не картинка' }, { status: 415, statusText: 'Unsupported Media Type' });

    expect(component.recognizeError()).toContain('JPEG/PNG/WebP');
  });

  it('отправляет только фото, если текст не заполнен', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.imageFile.set(
      new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
        type: 'image/jpeg',
      }),
    );
    component.voiceText.set('   ');
    component.recognizeByPhoto();

    const request = httpMock.expectOne({
      method: 'POST',
      url: '/api/recognition/parse',
    });
    const body = request.request.body as FormData;

    expect(body.get('image')).toBeTruthy();
    expect(body.get('text')).toBeNull();

    request.flush({
      document_number: null,
      document_date: null,
      supplier_name: null,
      general_comment: null,
      items: [],
    });
  });

  it('не отправляет запрос без фото', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.recognizeByPhoto();

    httpMock.expectNone('/api/recognition/parse');
  });

  it('отправляет только текст, если фото не выбрано', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.voiceText.set('  шайба цинк 10 — сто штук  ');
    component.parseVoice();

    const request = httpMock.expectOne({
      method: 'POST',
      url: '/api/recognition/parse',
    });
    const body = request.request.body as FormData;

    expect(body.get('image')).toBeNull();
    expect(body.get('text')).toBe('шайба цинк 10 — сто штук');

    request.flush({
      document_number: null,
      document_date: null,
      supplier_name: null,
      general_comment: null,
      items: [],
    });
  });

  it('не отправляет запрос без текста', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.parseVoice();

    httpMock.expectNone('/api/recognition/parse');
  });

  it('не смешивает состояния кнопок «Распознать по фото» и «Заполнить по тексту»', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.voiceText.set('шайба сто штук');
    component.imageFile.set(
      new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
        type: 'image/jpeg',
      }),
    );
    fixture.detectChanges();

    component.recognizeByPhoto();
    fixture.detectChanges();

    const request = httpMock.expectOne({
      method: 'POST',
      url: '/api/recognition/parse',
    });

    // Блок фото открыт вкладкой: кнопка занята, а текстовая осталась свободной.
    openTab('Фото накладной');
    const photoButtons = Array.from(
      fixture.nativeElement.querySelectorAll(
        'button.action',
      ) as NodeListOf<HTMLButtonElement>,
    );
    const photoButton = photoButtons.find((button) =>
      button.textContent?.includes('Распознаём'),
    );

    openTab('Голосовой ввод');
    const voiceButtons = Array.from(
      fixture.nativeElement.querySelectorAll(
        'button.action',
      ) as NodeListOf<HTMLButtonElement>,
    );
    const textButton = voiceButtons.find((button) =>
      button.textContent?.includes('Заполнить по тексту'),
    );

    expect(photoButton).toBeTruthy();
    expect(textButton).toBeTruthy();
    expect(textButton?.disabled).toBe(false);
    expect(component.recognizingPhoto()).toBe(true);
    expect(component.recognizingText()).toBe(false);

    request.flush({
      document_number: null,
      document_date: null,
      supplier_name: null,
      general_comment: null,
      items: [],
    });
  });

  it('очищает выбранное фото', () => {
    flushHeader();

    const component = fixture.componentInstance;
    component.imageFile.set(
      new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
        type: 'image/jpeg',
      }),
    );
    fixture.detectChanges();

    component.clearPhoto();
    fixture.detectChanges();

    expect(component.imageFile()).toBeNull();
    expect(component.recognizingPhoto()).toBe(false);
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
    httpMock.expectOne('/api/nomenclature/next-code').flush({ код: 'НМ-00042' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-quick-create-item')).toBeTruthy();
  });
});
