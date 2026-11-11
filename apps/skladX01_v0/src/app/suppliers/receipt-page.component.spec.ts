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

  it('подбирает номенклатуру и подставляет цену', () => {
    flushHeader();

    const component = fixture.componentInstance;

    jest.useFakeTimers();
    component.setRowName(1, {
      target: { value: 'Цемент' },
    } as unknown as Event);
    fixture.detectChanges();

    jest.advanceTimersByTime(400);
    jest.useRealTimers();

    const candidatesRequest = httpMock.expectOne(
      (request) => request.url === '/api/nomenclature/candidates',
    );
    expect(candidatesRequest.request.params.get('q')).toBe('Цемент');
    candidatesRequest.flush([
      {
        id: 5,
        name: 'Цемент М500',
        price: 450,
        score: 88,
        cosine: 0.9,
        lexical: 80,
      },
    ]);

    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select.candidates',
    ) as HTMLSelectElement;
    select.value = '5';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const row = component.rows()[0];
    expect(row.productId).toBe(5);
    expect(row.name).toBe('Цемент М500');
    expect(row.price).toBe(450);
  });
});
