import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCreateItemComponent } from './quick-create-item.component';

const REFERENCES = {
  группы: [{ id: 4, название: 'Крепёж' }],
  виды: [{ id: 2, название: 'болт' }],
  типы: [{ id: 1, название: 'Товар' }],
  единицы: [{ id: 3, название: 'шт' }],
};

const CHARACTERISTICS = [
  {
    id: 11,
    название: 'Длина',
    типЗначения: 'Number',
    обязательный: true,
    минимум: 10,
    максимум: 200,
    максимальнаяДлина: null,
    списокЗначений: [],
  },
  {
    id: 12,
    название: 'Материал',
    типЗначения: 'List',
    обязательный: false,
    минимум: null,
    максимум: null,
    максимальнаяДлина: null,
    списокЗначений: ['Сталь', 'Нержавейка'],
  },
];

describe('QuickCreateItemComponent', () => {
  let fixture: ComponentFixture<QuickCreateItemComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickCreateItemComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickCreateItemComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Базовый экземпляр тоже запрашивает код и справочники.
    httpMock.expectOne('/api/nomenclature/references').flush(REFERENCES);
    httpMock.expectOne('/api/nomenclature/next-code').flush({ код: 'НМ-00042' });
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('загружает справочники и подставляет распознанную строку', () => {
    const fresh = TestBed.createComponent(QuickCreateItemComponent);
    fresh.componentRef.setInput('initialName', 'Шайба Цинк_10');
    fresh.componentRef.setInput('initialArticle', 'SH-10');
    fresh.componentRef.setInput('initialUnit', 'штук');
    fresh.componentRef.setInput('initialPurchasePrice', 12.5);
    fresh.detectChanges();

    httpMock.expectOne('/api/nomenclature/references').flush(REFERENCES);
    httpMock.expectOne('/api/nomenclature/next-code').flush({ код: 'НМ-00042' });
    fresh.detectChanges();

    const component = fresh.componentInstance;
    expect(component.references().units.length).toBe(1);
    expect(component.name()).toBe('Шайба Цинк_10');
    expect(component.article()).toBe('SH-10');
    expect(component.purchasePrice()).toBe(12.5);
    expect(component.unitId()).toBe(3);
    expect(component.code()).toBe('НМ-00042');
    expect(fresh.nativeElement.textContent).toContain('Крепёж');
  });

  it('подгружает характеристики при выборе вида', () => {


    const component = fixture.componentInstance;
    component.setKind({ target: { value: '2' } } as unknown as Event);

    httpMock
      .expectOne('/api/nomenclature/kinds/2/characteristics')
      .flush(CHARACTERISTICS);
    fixture.detectChanges();

    expect(component.characteristics().length).toBe(2);
    expect(component.characteristics()[1].listValues).toEqual([
      'Сталь',
      'Нержавейка',
    ]);
  });

  it('создаёт позицию и отдаёт результат наружу', () => {


    const component = fixture.componentInstance;
    let createdId: number | undefined;
    let createdUnit: string | undefined;
    component.created.subscribe((item) => {
      createdId = item.id;
      createdUnit = item.unit;
    });

    component.setText('name', { target: { value: 'Болт ТЕСТ' } } as unknown as Event);
    component.setText('code', { target: { value: 'ТЕСТ-0001' } } as unknown as Event);
    component.setSelect('unitId', { target: { value: '3' } } as unknown as Event);
    component.save();

    const request = httpMock.expectOne({ method: 'POST', url: '/api/nomenclature' });
    expect(request.request.body.код).toBe('ТЕСТ-0001');
    expect(request.request.body.базоваяЕдИзмId).toBe(3);

    request.flush({ id: 42, код: 'ТЕСТ-0001', название: 'Болт ТЕСТ' });
    fixture.detectChanges();

    expect(createdId).toBe(42);
    expect(createdUnit).toBe('шт');
  });

  it('показывает ошибку, если код уже занят', () => {


    const component = fixture.componentInstance;
    component.setText('name', { target: { value: 'Дубль' } } as unknown as Event);
    component.setText('code', { target: { value: 'НМ-00001' } } as unknown as Event);
    component.setSelect('unitId', { target: { value: '3' } } as unknown as Event);
    component.save();

    httpMock.expectOne({ method: 'POST', url: '/api/nomenclature' }).flush(
      { error: 'Позиция с таким кодом уже существует.' },
      { status: 409, statusText: 'Conflict' },
    );
    fixture.detectChanges();

    expect(component.error()).toContain('уже существует');
  });

  it('не отправляет пустые характеристики («— не выбрано —»)', () => {
    const component = fixture.componentInstance;
    component.setKind({ target: { value: '2' } } as unknown as Event);

    httpMock
      .expectOne('/api/nomenclature/kinds/2/characteristics')
      .flush(CHARACTERISTICS);

    component.setText('name', { target: { value: 'Болт ТЕСТ' } } as unknown as Event);
    component.setText('code', { target: { value: 'ТЕСТ-0002' } } as unknown as Event);
    component.setSelect('unitId', { target: { value: '3' } } as unknown as Event);
    component.setCharacteristicValue(11, {
      target: { value: ' 60 ' },
    } as unknown as Event);

    component.save();

    const request = httpMock.expectOne({ method: 'POST', url: '/api/nomenclature' });

    expect(request.request.body.характеристики).toEqual([
      { характеристикаId: 11, значение: '60' },
    ]);

    request.flush({ id: 43, код: 'ТЕСТ-0002', название: 'Болт ТЕСТ' });
  });

  it('показывает текст ошибки, если API ответил не JSON', () => {
    const component = fixture.componentInstance;
    component.setText('name', { target: { value: 'Болт ТЕСТ' } } as unknown as Event);
    component.setText('code', { target: { value: 'ТЕСТ-0003' } } as unknown as Event);
    component.setSelect('unitId', { target: { value: '3' } } as unknown as Event);
    component.save();

    httpMock.expectOne({ method: 'POST', url: '/api/nomenclature' }).flush(
      'SqlException: Значение характеристики не соответствует её типу',
      { status: 500, statusText: 'Internal Server Error' },
    );
    fixture.detectChanges();

    expect(component.error()).toContain('Значение характеристики');
  });

  it('показывает detail из ProblemDetails', () => {
    const component = fixture.componentInstance;
    component.setText('name', { target: { value: 'Болт ТЕСТ' } } as unknown as Event);
    component.setText('code', { target: { value: 'ТЕСТ-0004' } } as unknown as Event);
    component.setSelect('unitId', { target: { value: '3' } } as unknown as Event);
    component.save();

    httpMock.expectOne({ method: 'POST', url: '/api/nomenclature' }).flush(
      { title: 'Bad Request', detail: 'Связанный справочник не найден.', status: 400 },
      { status: 400, statusText: 'Bad Request' },
    );
    fixture.detectChanges();

    expect(component.error()).toBe('Связанный справочник не найден.');
  });
});
