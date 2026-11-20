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
  Router,
} from '@angular/router';

import { ToastService } from '../shared/toast.service';
import { InvoicePageComponent } from './invoice-page.component';

const CLIENT = {
  id: 7,
  псевдоним: 'Тестовый клиент',
  фио: 'Иванов',
  телефон: '123',
  город: 'Туапсе',
  пределКредита: 1000,
  активен: true,
};

describe('InvoicePageComponent', () => {
  let fixture: ComponentFixture<InvoicePageComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let toast: ToastService;

  function setup(dealId: string | null): void {
    TestBed.configureTestingModule({
      imports: [InvoicePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '7' }),
              queryParamMap: convertToParamMap(dealId ? { dealId } : {}),
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(InvoicePageComponent);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    toast = TestBed.inject(ToastService);
    fixture.detectChanges();
  }

  function flushClientAndDeals(): void {
    httpMock.expectOne('/api/clients/7').flush(CLIENT);
    httpMock.expectOne('/api/clients/7/marks').flush([
      { id: 'd1', номер: 'R-000001', долг: 0 },
      { id: 'd2', номер: 'R-000002', долг: 0 },
    ]);

    fixture.detectChanges();
  }

  function saveButton(): HTMLButtonElement {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll(
        'button.action',
      ) as NodeListOf<HTMLButtonElement>,
    );

    return buttons.find(
      (button) => button.textContent?.trim() === 'Сохранить',
    ) as HTMLButtonElement;
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('показывает клиента и выбранную сделку', () => {
    setup('d2');
    flushClientAndDeals();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Тестовый клиент');
    expect(text).toContain('R-000002');
    expect(fixture.componentInstance.deal()?.id).toBe('d2');
  });

  it('предупреждает, если сделка не выбрана', () => {
    setup(null);
    flushClientAndDeals();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Сделка не выбрана');
  });

  it('считает итог по строке и добавляет новые строки', () => {
    setup('d1');
    flushClientAndDeals();

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

  it('заполняет строки по распознанному тексту', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.voiceText.set('Цемент 20 мешков');
    fixture.detectChanges();

    component.parseVoice();

    httpMock
      .expectOne({ method: 'POST', url: '/api/invoice/parse-voice' })
      .flush([
        {
          productId: 1,
          productSku: 'CEM500',
          dbName: 'Цемент М-500 (50кг)',
          voiceName: 'Цемент',
          quantity: 20,
          unit: 'мешков',
          matchConfidence: 80,
        },
        {
          productId: null,
          productSku: '',
          dbName: 'НЕ НАЙДЕНО В БД',
          voiceName: 'Песок',
          quantity: 3,
          unit: 'т',
          matchConfidence: 0,
        },
      ]);

    // для ненайденной строки страница сама запрашивает кандидатов
    const candidatesRequest = httpMock.expectOne(
      (request) => request.url === '/api/nomenclature/candidates',
    );
    expect(candidatesRequest.request.params.get('q')).toBe('Песок');
    candidatesRequest.flush([
      { id: 5, name: 'Песок строительный', price: 300, score: 71.2, cosine: 0.8, lexical: 60 },
    ]);

    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(2);
    expect(rows[0].name).toBe('Цемент М-500 (50кг)');
    expect(rows[0].qty).toBe(20);
    expect(rows[1].name).toBe('Песок');
    expect(rows[1].candidates.length).toBe(1);

    const select = fixture.nativeElement.querySelector(
      'select.candidates',
    ) as HTMLSelectElement;
    expect(select).toBeTruthy();

    select.value = '5';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const chosen = component.rows()[1];
    expect(chosen.productId).toBe(5);
    expect(chosen.name).toBe('Песок строительный');
    expect(chosen.price).toBe(300);
  });

  it('дописывает распознанные позиции к уже введённым строкам', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.rows.update((rows) =>
      rows.map((row) =>
        row.id === 1
          ? { ...row, productId: 77, name: 'Гвозди 2,5х50', qty: 2, price: 50 }
          : row,
      ),
    );
    component.voiceText.set('шайба цинк 10, 10 штук; шайба цинк 10, 5 штук');
    fixture.detectChanges();

    component.parseVoice();

    httpMock
      .expectOne({ method: 'POST', url: '/api/invoice/parse-voice' })
      .flush([
        {
          productId: 141,
          productSku: '',
          dbName: 'Шайба Цинк_10',
          voiceName: 'шайба цинк 10',
          quantity: 10,
          unit: 'штук',
          matchConfidence: 100,
        },
        {
          productId: 141,
          productSku: '',
          dbName: 'Шайба Цинк_10',
          voiceName: 'шайба цинк 10',
          quantity: 5,
          unit: 'штук',
          matchConfidence: 100,
        },
      ]);

    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(3);
    expect(rows[0].name).toBe('Гвозди 2,5х50');
    expect(rows[0].productId).toBe(77);
    expect(rows[0].qty).toBe(2);
    expect(rows[1].productId).toBe(141);
    expect(rows[1].qty).toBe(10);
    expect(rows[2].productId).toBe(141);
    expect(rows[2].qty).toBe(5);
    expect(new Set(rows.map((row) => row.id)).size).toBe(3);
  });

  it('не оставляет пустых строк-заготовок после голосового разбора', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    // Пользователь уже ввёл товар и оставил пустую строку под следующий.
    component.rows.update((rows) => [
      { ...rows[0], productId: 77, name: 'Гвозди 70', qty: 1, price: 100 },
      { ...rows[0], id: 2 },
    ]);

    component.voiceText.set('Цемент 20 мешков');
    component.parseVoice();

    httpMock
      .expectOne({ method: 'POST', url: '/api/invoice/parse-voice' })
      .flush([
        {
          productId: 1,
          productSku: 'CEM500',
          dbName: 'Цемент М-500 (50кг)',
          voiceName: 'Цемент',
          quantity: 20,
          unit: 'мешков',
          matchConfidence: 80,
        },
      ]);

    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(2);
    expect(rows.every((row) => row.name.trim().length > 0)).toBe(true);
    expect(rows[1].name).toBe('Цемент М-500 (50кг)');
  });

  it('отбрасывает позицию без наименования из ответа модели', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.voiceText.set('Цемент 20 мешков');
    component.parseVoice();

    httpMock
      .expectOne({ method: 'POST', url: '/api/invoice/parse-voice' })
      .flush([
        {
          productId: 1,
          productSku: 'CEM500',
          dbName: 'Цемент М-500 (50кг)',
          voiceName: 'Цемент',
          quantity: 20,
          unit: 'мешков',
          matchConfidence: 80,
        },
        {
          productId: null,
          productSku: '',
          dbName: '',
          voiceName: '',
          quantity: 1,
          unit: null,
          matchConfidence: 0,
        },
      ]);

    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe('Цемент М-500 (50кг)');
  });

  it('ищет номенклатуру с клавиатуры через quick-search', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;

    jest.useFakeTimers();
    component.setRowName(1, {
      target: { value: 'Песок' },
    } as unknown as Event);
    fixture.detectChanges();

    jest.advanceTimersByTime(200);
    jest.useRealTimers();

    const quickRequest = httpMock.expectOne(
      (request) => request.url === '/api/nomenclature/quick-search',
    );
    expect(quickRequest.request.params.get('q')).toBe('Песок');
    quickRequest.flush([
      {
        id: 12,
        код: 'НМ-00012',
        артикул: null,
        название: 'Песок строительный',
        едИзм: 'т',
        ценаЗакупочная: 250,
        ценаПродажная: 300,
      },
    ]);

    fixture.detectChanges();

    const row = component.rows()[0];
    expect(row.suggestions.length).toBe(1);

    component.chooseSuggestion(1, row.suggestions[0]);
    fixture.detectChanges();

    const chosen = component.rows()[0];
    expect(chosen.productId).toBe(12);
    expect(chosen.name).toBe('Песок строительный');
    expect(chosen.unit).toBe('т');
    expect(chosen.price).toBe(300);
  });

  it('открывает модалку быстрого создания из строки «Создать новую»', () => {
    setup('d1');
    flushClientAndDeals();

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

  it('подставляет созданную позицию в строку накладной', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.openQuickCreate(1);

    component.onQuickCreated({
      id: 99,
      code: 'НМ-00099',
      article: '',
      name: 'Новая позиция',
      unit: 'шт',
      purchasePrice: 100,
      salePrice: 150,
    });

    fixture.detectChanges();

    const row = component.rows()[0];
    expect(component.quickCreateRowId()).toBeNull();
    expect(row.productId).toBe(99);
    expect(row.name).toBe('Новая позиция');
    expect(row.unit).toBe('шт');
    expect(row.price).toBe(150);
  });

  it('сохраняет накладную и возвращает на карточку клиента', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.rows.set([
      {
        ...component.rows()[0],
        productId: 139,
        name: 'Шайба Цинк_10',
        qty: 2,
        price: 350.5,
      },
    ]);
    component.setComment({
      target: { value: '  Отгрузка  ' },
    } as unknown as Event);
    fixture.detectChanges();

    const navigate = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const show = jest.spyOn(toast, 'show');

    saveButton().click();

    const request = httpMock.expectOne('/api/clients/marks/d1/products');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      дата: component.date(),
      комментарий: 'Отгрузка',
      строки: [{ номенклатураId: 139, количество: 2, цена: 350.5 }],
    });

    request.flush({
      id: 501,
      номер: 'О-ABC123',
      дата: '2026-11-19T00:00:00',
      сумма: 701,
      сделкаId: 'd1',
      изменялась: false,
    });

    expect(show).toHaveBeenCalledWith('Накладная сохранена.');
    expect(navigate).toHaveBeenCalledWith(['/clients', 7]);
    expect(component.saving()).toBe(false);
  });

  it('не отправляет строку без выбранного товара', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.rows.set([
      { ...component.rows()[0], name: 'Песок', qty: 1, price: 10 },
    ]);
    fixture.detectChanges();

    saveButton().click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Строка 1: выберите товар из номенклатуры.',
    );
    httpMock.expectNone('/api/clients/marks/d1/products');
  });

  it('показывает ошибку сервера при сохранении', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.rows.set([
      {
        ...component.rows()[0],
        productId: 139,
        name: 'Шайба Цинк_10',
        qty: 1,
        price: 10,
      },
    ]);
    fixture.detectChanges();

    saveButton().click();

    httpMock
      .expectOne('/api/clients/marks/d1/products')
      .flush(
        { error: 'Номенклатура 999 не найдена.' },
        { status: 400, statusText: 'Bad Request' },
      );

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Номенклатура 999 не найдена.',
    );
  });

  it('отключает сохранение без выбранной сделки', () => {
    setup(null);
    flushClientAndDeals();

    expect(saveButton().disabled).toBe(true);
  });
});
