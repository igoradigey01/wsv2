import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(InvoiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('отправляет текст и приводит совпавшую позицию', () => {
    let rows: unknown[] = [];

    service.parseVoice('шайба цинк 10').subscribe((value) => (rows = value));

    const request = httpMock.expectOne('/api/invoice/parse-voice');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ rawText: 'шайба цинк 10' });

    request.flush([
      {
        productId: 139,
        productSku: '',
        dbName: 'Шайба Цинк_10',
        voiceName: 'шайба цинк 10',
        quantity: 100,
        unit: 'штук',
        matchConfidence: 100,
      },
    ]);

    expect(rows).toEqual([
      {
        productId: 139,
        sku: '',
        name: 'Шайба Цинк_10',
        voiceName: 'шайба цинк 10',
        qty: 100,
        unit: 'штук',
        confidence: 100,
        matched: true,
      },
    ]);
  });

  it('для ненайденного товара оставляет распознанное название', () => {
    let rows: unknown[] = [];

    service.parseVoice('балка 100х100').subscribe((value) => (rows = value));

    httpMock.expectOne('/api/invoice/parse-voice').flush([
      {
        productId: null,
        productSku: '',
        dbName: 'НЕ НАЙДЕНО В БД',
        voiceName: 'балка 100х100',
        quantity: 2,
        unit: 'м',
        matchConfidence: 0,
      },
    ]);

    expect(rows).toEqual([
      {
        productId: null,
        sku: '',
        name: 'балка 100х100',
        voiceName: 'балка 100х100',
        qty: 2,
        unit: 'м',
        confidence: 0,
        matched: false,
      },
    ]);
  });

  it('создаёт накладную и возвращает шапку', () => {
    let created: unknown = null;

    service
      .createInvoice('d1', {
        дата: '2026-11-19',
        комментарий: null,
        строки: [{ номенклатураId: 139, количество: 2, цена: 350.5 }],
      })
      .subscribe((value) => (created = value));

    const request = httpMock.expectOne('/api/clients/marks/d1/products');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      дата: '2026-11-19',
      комментарий: null,
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

    expect(created).toEqual({
      id: 501,
      номер: 'О-ABC123',
      дата: '2026-11-19T00:00:00',
      сумма: 701,
      сделкаId: 'd1',
      изменялась: false,
    });
  });
});
