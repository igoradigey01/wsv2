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
  категории: [{ id: 1, название: 'Товар' }],
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
  });

  function flushReferences(): void {
    httpMock.expectOne('/api/nomenclature/references').flush(REFERENCES);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('загружает справочники и подставляет название из строки', () => {
    httpMock.expectOne('/api/nomenclature/references').flush(REFERENCES);

    const fresh = TestBed.createComponent(QuickCreateItemComponent);
    fresh.componentRef.setInput('initialName', 'Болт М12');
    fresh.detectChanges();

    httpMock.expectOne('/api/nomenclature/references').flush(REFERENCES);
    fresh.detectChanges();

    expect(fresh.componentInstance.references().units.length).toBe(1);
    expect(fresh.componentInstance.name()).toBe('Болт М12');
    expect(fresh.nativeElement.textContent).toContain('Крепёж');
  });

  it('подгружает характеристики при выборе вида', () => {
    flushReferences();

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
    flushReferences();

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
    flushReferences();

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
});
