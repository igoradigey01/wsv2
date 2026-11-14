import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { of } from 'rxjs';

import { SupplierDetailComponent } from './supplier-detail.component';

const SUPPLIER = {
  id: 2,
  название: 'Брянск',
  город: 'Брянск',
  телефон: '89180000000',
};

const SUMMARY = {
  поставщикId: 2,
  название: 'Брянск',
  город: 'Брянск',
  телефон: '89180000000',
  сделок: 2,
  получено: 1000,
  отдано: 400,
  долг: 600,
  переплата: 0,
};

const DEALS = [
  { id: 'd1', номер: 'P-000001', долг: 200 },
  { id: 'd2', номер: 'P-000002', долг: 0, комментарий: 'Оплачено полностью' },
];

const PRODUCTS = [
  {
    id: 'a1',
    номер: 'П-000005',
    дата: '2023-10-23T00:00:00',
    сумма: 100,
    сделкаId: 'd2',
  },
  {
    id: 'a2',
    номер: 'П-000006',
    дата: '2024-05-01T00:00:00',
    сумма: 200,
    сделкаId: 'd2',
  },
];

const PAYMENTS = [
  { id: 20, дата: '2024-06-01T00:00:00', сумма: 300, сделкаId: 'd2' },
];

describe('SupplierDetailComponent', () => {
  let fixture: ComponentFixture<SupplierDetailComponent>;
  let httpMock: HttpTestingController;

  function setup(id: string, narrow = false): void {
    TestBed.configureTestingModule({
      imports: [SupplierDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id })) },
        },
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: narrow, breakpoints: {} }) },
        },
      ],
    });

    fixture = TestBed.createComponent(SupplierDetailComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  function flushSupplier(
    summary: unknown = SUMMARY,
    deals: unknown = DEALS,
  ): void {
    httpMock.expectOne('/api/suppliers/2').flush(SUPPLIER);
    httpMock.expectOne('/api/suppliers/2/summary').flush(summary);
    httpMock.expectOne('/api/suppliers/2/deals').flush(deals);
    fixture.detectChanges();
  }

  function flushLatestDealData(): void {
    httpMock.expectOne('/api/suppliers/deals/d2/products').flush(PRODUCTS);
    httpMock.expectOne('/api/suppliers/deals/d2/payments').flush(PAYMENTS);
    fixture.detectChanges();
  }

  it('показывает шапку, сводку и данные последней сделки', () => {
    setup('2');
    flushSupplier();
    flushLatestDealData();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Брянск');
    expect(text).toContain('89180000000');
    expect(text).toContain('Получено');
    expect(text).toContain('1,000.00');
    expect(text).toContain('P-000002');
    expect(text).toContain('23.10.2023');
    expect(text).toContain('Итого:');

    expect(fixture.componentInstance.selectedDealId()).toBe('d2');
    expect(fixture.componentInstance.productsTotal()).toBe(300);
    expect(fixture.componentInstance.paymentsTotal()).toBe(300);

    const receiptLink = fixture.nativeElement.querySelector(
      'a[href="/suppliers/2/receipt/new"]',
    );
    expect(receiptLink).toBeTruthy();
  });

  it('фильтрует принятый товар и отданные деньги по дате «начиная»', () => {
    setup('2');
    flushSupplier();
    flushLatestDealData();

    fixture.componentInstance.fromDate.set('2024-01-01');
    fixture.detectChanges();

    expect(fixture.componentInstance.filteredProducts().length).toBe(1);
    expect(fixture.componentInstance.productsTotal()).toBe(200);
    expect(fixture.componentInstance.filteredPayments().length).toBe(1);
    expect(fixture.componentInstance.paymentsTotal()).toBe(300);

    const text = fixture.nativeElement.textContent as string;
    expect(text).not.toContain('23.10.2023');
  });

  it('блок «КодСделки» свернут и показывает последнюю сделку', () => {
    setup('2');
    flushSupplier();
    flushLatestDealData();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('КодСделки');
    expect(text).toContain('№P-000002');
    expect(fixture.componentInstance.dealsOpen()).toBe(false);
    expect(fixture.nativeElement.querySelector('.grid--selectable')).toBeNull();

    const head = fixture.nativeElement.querySelector(
      '.block__head',
    ) as HTMLElement;
    head.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dealsOpen()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.grid--selectable'),
    ).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Оплачено полностью');
  });

  it('выбор сделки загружает её товар и деньги', () => {
    setup('2');
    flushSupplier();
    flushLatestDealData();

    fixture.componentInstance.toggleDeals();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll(
      '.grid--selectable tbody tr',
    ) as NodeListOf<HTMLElement>;
    expect(rows.length).toBe(2);
    rows[0].click();

    httpMock.expectOne('/api/suppliers/deals/d1/products').flush([
      {
        id: 'a9',
        номер: 'П-000009',
        дата: '2023-11-10T00:00:00',
        сумма: 200,
        сделкаId: 'd1',
      },
    ]);
    httpMock.expectOne('/api/suppliers/deals/d1/payments').flush([]);
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedDealId()).toBe('d1');
    expect(fixture.componentInstance.productsTotal()).toBe(200);
    expect(fixture.nativeElement.textContent).toContain('П-000009');
    expect(fixture.nativeElement.textContent).toContain('Нет отданных денег.');
  });

  it('на узком экране объединяет блоки во вкладки', () => {
    setup('2', true);
    flushSupplier();
    flushLatestDealData();

    const element = fixture.nativeElement as HTMLElement;
    const tabs = element.querySelectorAll('app-tabs [role="tab"]');

    expect(tabs.length).toBe(2);
    expect(tabs[0].textContent).toContain('Принятый товар');
    expect(tabs[1].textContent).toContain('Отданные деньги');
    expect(element.querySelectorAll('.tabs__panel section.block').length).toBe(
      1,
    );
    expect(element.querySelectorAll('.blocks > section.block').length).toBe(1);
  });

  it('на широком экране показывает все три блока одновременно', () => {
    setup('2');
    flushSupplier();
    flushLatestDealData();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-tabs')).toBeNull();
    expect(element.querySelectorAll('.blocks > section.block').length).toBe(3);
  });

  it('показывает «Поставщик не найден» при 404', () => {
    setup('2');

    httpMock.expectOne('/api/suppliers/2/summary').flush({});
    httpMock.expectOne('/api/suppliers/2/deals').flush([]);
    httpMock
      .expectOne('/api/suppliers/2')
      .flush('', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(fixture.componentInstance.notFound()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Поставщик не найден');
  });
});
