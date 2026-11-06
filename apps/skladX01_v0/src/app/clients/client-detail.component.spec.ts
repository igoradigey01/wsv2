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
import { of } from 'rxjs';

import { ClientDetailComponent } from './client-detail.component';

describe('ClientDetailComponent', () => {
  let fixture: ComponentFixture<ClientDetailComponent>;
  let httpMock: HttpTestingController;

  function setup(clientId: string): void {
    TestBed.configureTestingModule({
      imports: [ClientDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: clientId })) },
        },
      ],
    });

    fixture = TestBed.createComponent(ClientDetailComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('загружает клиента, метки и данные первой метки', () => {
    setup('7');

    httpMock.expectOne('/api/clients/7').flush({
      id: 7,
      псевдоним: 'Тестовый клиент',
      фио: 'Иванов',
      телефон: '123',
      город: 'Туапсе',
      пределКредита: 1000,
      активен: true,
    });

    httpMock.expectOne('/api/clients/7/summary').flush({
      клиентId: 7,
      псевдоним: 'Тестовый клиент',
      пределКредита: 1000,
      активен: true,
      сделок: 2,
      активныхСделок: 1,
      отгружено: 500,
      оплачено: 300,
      долг: 200,
      переплата: 0,
      превышенЛимит: false,
    });

    httpMock
      .expectOne('/api/clients/7/marks')
      .flush([
        { id: 1, номер: 'R-000001', долг: 200 },
        { id: 2, номер: 'R-000002', долг: 0 },
      ]);

    httpMock.expectOne('/api/clients/marks/2/products').flush([
      {
        id: 10,
        номер: '5',
        дата: '2023-10-23T00:00:00',
        сумма: 100,
        меткаId: 2,
      },
      {
        id: 11,
        номер: '6',
        дата: '2024-05-01T00:00:00',
        сумма: 200,
        меткаId: 2,
      },
    ]);

    httpMock.expectOne('/api/clients/marks/2/payments').flush([
      { id: 20, дата: '2024-06-01T00:00:00', сумма: 300, меткаId: 2 },
    ]);

    fixture.detectChanges();

    expect(fixture.componentInstance.selectedMarkId()).toBe(2);
    expect(fixture.componentInstance.productsTotal()).toBe(300);

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Тестовый клиент');
    expect(text).toContain('R-000002');
    expect(text).toContain('23.10.2023');
    expect(text).toContain('Итого:');
  });

  it('фильтрует товары и деньги по дате «начиная»', () => {
    setup('7');

    httpMock.expectOne('/api/clients/7').flush({
      id: 7,
      псевдоним: 'Тестовый клиент',
      фио: 'Иванов',
      телефон: '123',
      город: 'Туапсе',
      пределКредита: 1000,
      активен: true,
    });

    httpMock.expectOne('/api/clients/7/summary').flush({});

    httpMock
      .expectOne('/api/clients/7/marks')
      .flush([{ id: 1, номер: 'R-000001', долг: 200 }]);

    httpMock.expectOne('/api/clients/marks/1/products').flush([
      {
        id: 10,
        номер: '5',
        дата: '2023-10-23T00:00:00',
        сумма: 100,
        меткаId: 1,
      },
      {
        id: 11,
        номер: '6',
        дата: '2024-05-01T00:00:00',
        сумма: 200,
        меткаId: 1,
      },
    ]);

    httpMock.expectOne('/api/clients/marks/1/payments').flush([
      { id: 20, дата: '2023-12-01T00:00:00', сумма: 300, меткаId: 1 },
      { id: 21, дата: '2024-06-01T00:00:00', сумма: 400, меткаId: 1 },
    ]);

    fixture.componentInstance.fromDate.set('2024-01-01');
    fixture.detectChanges();

    expect(fixture.componentInstance.filteredProducts().length).toBe(1);
    expect(fixture.componentInstance.productsTotal()).toBe(200);
    expect(fixture.componentInstance.filteredPayments().length).toBe(1);
    expect(fixture.componentInstance.paymentsTotal()).toBe(400);

    const text = fixture.nativeElement.textContent as string;
    expect(text).not.toContain('23.10.2023');
  });

  it('показывает «Клиент не найден» при 404', () => {
    setup('99');

    httpMock.expectOne('/api/clients/99/summary').flush({});
    httpMock.expectOne('/api/clients/99/marks').flush([]);
    httpMock
      .expectOne('/api/clients/99')
      .flush('', { status: 404, statusText: 'Not Found' });

    fixture.detectChanges();

    expect(fixture.componentInstance.notFound()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Клиент не найден');
  });

  it('блок «КодСделки» свернут и показывает последнюю сделку', () => {
    setup('7');

    httpMock.expectOne('/api/clients/7').flush({
      id: 7,
      псевдоним: 'Тестовый клиент',
      фио: 'Иванов',
      телефон: '123',
      город: 'Туапсе',
      пределКредита: 1000,
      активен: true,
    });
    httpMock.expectOne('/api/clients/7/summary').flush({});
    httpMock.expectOne('/api/clients/7/marks').flush([
      { id: 1, номер: 'R-000001', долг: 200 },
      { id: 2, номер: 'R-000002', долг: 0 },
    ]);
    httpMock.expectOne('/api/clients/marks/2/products').flush([]);
    httpMock.expectOne('/api/clients/marks/2/payments').flush([]);

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('КодСделки');
    expect(text).toContain('№R-000002');
    expect(fixture.componentInstance.dealsOpen()).toBe(false);
    expect(fixture.nativeElement.querySelector('.grid--selectable')).toBeNull();

    const head = fixture.nativeElement.querySelector(
      '.block__head',
    ) as HTMLElement;
    head.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dealsOpen()).toBe(true);
    expect(fixture.nativeElement.querySelector('.grid--selectable')).not.toBeNull();
  });
});
