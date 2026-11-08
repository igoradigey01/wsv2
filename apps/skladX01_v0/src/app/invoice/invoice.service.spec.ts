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
});
