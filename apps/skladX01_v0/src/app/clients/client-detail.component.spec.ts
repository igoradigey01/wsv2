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
        { id: 'd1', номер: 'R-000001', долг: 200 },
        { id: 'd2', номер: 'R-000002', долг: 0 },
      ]);

    httpMock.expectOne('/api/clients/marks/d2/products').flush([
      {
        id: 10,
        номер: '5',
        дата: '2023-10-23T00:00:00',
        сумма: 100,
        сделкаId: 'd2',
      },
      {
        id: 11,
        номер: '6',
        дата: '2024-05-01T00:00:00',
        сумма: 200,
        сделкаId: 'd2',
      },
    ]);

    httpMock.expectOne('/api/clients/marks/d2/payments').flush([
      { id: 20, дата: '2024-06-01T00:00:00', сумма: 300, сделкаId: 'd2' },
    ]);

    fixture.detectChanges();

    expect(fixture.componentInstance.selectedMarkId()).toBe('d2');
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
      .flush([{ id: 'd1', номер: 'R-000001', долг: 200 }]);

    httpMock.expectOne('/api/clients/marks/d1/products').flush([
      {
        id: 10,
        номер: '5',
        дата: '2023-10-23T00:00:00',
        сумма: 100,
        сделкаId: 'd1',
      },
      {
        id: 11,
        номер: '6',
        дата: '2024-05-01T00:00:00',
        сумма: 200,
        сделкаId: 'd1',
      },
    ]);

    httpMock.expectOne('/api/clients/marks/d1/payments').flush([
      { id: 20, дата: '2023-12-01T00:00:00', сумма: 300, сделкаId: 'd1' },
      { id: 21, дата: '2024-06-01T00:00:00', сумма: 400, сделкаId: 'd1' },
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
      { id: 'd1', номер: 'R-000001', долг: 200 },
      { id: 'd2', номер: 'R-000002', долг: 0 },
    ]);
    httpMock.expectOne('/api/clients/marks/d2/products').flush([]);
    httpMock.expectOne('/api/clients/marks/d2/payments').flush([]);

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

  it('создаёт сделку через POST и выбирает её', () => {
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
      .flush([{ id: 'd1', номер: 'R-000001', долг: 200 }]);
    httpMock.expectOne('/api/clients/marks/d1/products').flush([]);
    httpMock.expectOne('/api/clients/marks/d1/payments').flush([]);

    fixture.componentInstance.toggleDeals();
    fixture.componentInstance.newComment.set('тест');
    fixture.detectChanges();

    const button = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((btn) => btn.textContent?.includes('Создать новую сделку'));

    expect(button).toBeTruthy();
    button?.click();

    httpMock.expectOne({ method: 'POST', url: '/api/clients/7/marks' }).flush({
      id: 'd2',
      номер: 'R-000002',
      долг: 0,
    });
    httpMock.expectOne('/api/clients/marks/d2/products').flush([]);
    httpMock.expectOne('/api/clients/marks/d2/payments').flush([]);

    fixture.detectChanges();

    expect(fixture.componentInstance.marks().length).toBe(2);
    expect(fixture.componentInstance.selectedMarkId()).toBe('d2');
  });

  it('подсвечивает отрицательный долг', () => {
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
      .flush([{ id: 'd1', номер: 'R-000002', долг: -10300 }]);
    httpMock.expectOne('/api/clients/marks/d1/products').flush([]);
    httpMock.expectOne('/api/clients/marks/d1/payments').flush([]);

    fixture.componentInstance.toggleDeals();
    fixture.detectChanges();

    const negative = fixture.nativeElement.querySelectorAll('td.num--negative');
    expect(negative.length).toBe(1);
  });
});
