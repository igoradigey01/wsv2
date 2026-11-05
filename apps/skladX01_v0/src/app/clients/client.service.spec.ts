import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ClientService } from './client.service';
import type { IClient } from './client.models';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('передаёт q, sort и dir в запрос списка', () => {
    service.getClients({ q: 'Туапсе', sort: 'phone', dir: 'desc' }).subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/api/clients' &&
        request.params.get('q') === 'Туапсе' &&
        request.params.get('sort') === 'phone' &&
        request.params.get('dir') === 'desc',
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('переводит кириллические ключи API в поля модели', () => {
    let clients: IClient[] = [];

    service
      .getClients({ sort: 'alias', dir: 'asc' })
      .subscribe((value) => (clients = value));

    const req = httpMock.expectOne((request) => request.url === '/api/clients');

    req.flush([
      {
        id: 3,
        псевдоним: 'левый',
        фио: 'none',
        телефон: '7777777',
        город: 'none',
        пределКредита: 0,
        активен: true,
      },
    ]);

    expect(clients).toEqual([
      {
        id: 3,
        alias: 'левый',
        fullName: 'none',
        phone: '7777777',
        city: 'none',
        creditLimit: 0,
        active: true,
      },
    ]);
  });

  it('запрашивает карточку клиента', () => {
    service.getSummary(14).subscribe();

    const req = httpMock.expectOne('/api/clients/14/summary');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('запрашивает клиента по id', () => {
    service.getClient(14).subscribe();

    const req = httpMock.expectOne('/api/clients/14');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('переводит метки расчёта в модель', () => {
    let marks: unknown[] = [];

    service.getMarks(14).subscribe((value) => (marks = value));

    const req = httpMock.expectOne('/api/clients/14/marks');
    req.flush([{ id: 4, номер: 'R-000002', долг: -10300 }]);

    expect(marks).toEqual([{ id: 4, number: 'R-000002', debt: -10300 }]);
  });

  it('переводит отгруженные товары в модель', () => {
    let products: unknown[] = [];

    service.getProducts(4).subscribe((value) => (products = value));

    const req = httpMock.expectOne('/api/clients/marks/4/products');
    req.flush([
      {
        id: 124,
        номер: '33',
        дата: '2023-10-23T00:00:00',
        сумма: 12750,
        меткаId: 4,
      },
    ]);

    expect(products).toEqual([
      {
        id: 124,
        number: '33',
        date: '2023-10-23T00:00:00',
        amount: 12750,
        markId: 4,
      },
    ]);
  });

  it('переводит принятые деньги в модель', () => {
    let payments: unknown[] = [];

    service.getPayments(4).subscribe((value) => (payments = value));

    const req = httpMock.expectOne('/api/clients/marks/4/payments');
    req.flush([
      { id: 121, дата: '2023-10-23T00:00:00', сумма: 20000, меткаId: 4 },
    ]);

    expect(payments).toEqual([
      {
        id: 121,
        date: '2023-10-23T00:00:00',
        amount: 20000,
        markId: 4,
      },
    ]);
  });
});
