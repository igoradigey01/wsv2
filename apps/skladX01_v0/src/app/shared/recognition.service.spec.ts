import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { mapRecognizedDocument } from './recognition.models';
import { RecognitionService } from './recognition.service';

describe('mapRecognizedDocument', () => {
  it('переводит snake_case ответа в camelCase', () => {
    const document = mapRecognizedDocument({
      document_number: '1042',
      document_date: '19.11.2026',
      supplier_name: 'ООО "СтройБаза"',
      general_comment: null,
      items: [
        {
          line_number: 1,
          article: 'SH-10',
          name: 'Шайба цинк 10',
          unit: 'шт',
          price: 12.5,
          qty_doc: 10,
          qty_fact: 8,
          is_extra: false,
          item_comment: 'две штуки брак',
        },
      ],
    });

    expect(document.number).toBe('1042');
    expect(document.date).toBe('19.11.2026');
    expect(document.supplier).toBe('ООО "СтройБаза"');

    const item = document.items[0];
    expect(item.name).toBe('Шайба цинк 10');
    expect(item.qtyDoc).toBe(10);
    expect(item.qtyFact).toBe(8);
    expect(item.extra).toBe(false);
    expect(item.comment).toBe('две штуки брак');
    expect(item.lineNumber).toBe(1);
    expect(item.article).toBe('SH-10');
  });
});

describe('RecognitionService', () => {
  let service: RecognitionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(RecognitionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('отправляет фото в /api/recognition/parse', () => {
    const image = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'invoice.jpg', {
      type: 'image/jpeg',
    });
    let itemCount = -1;

    service.parse(image).subscribe((document) => {
      itemCount = document.items.length;
    });

    const request = httpMock.expectOne('/api/recognition/parse');
    expect(request.request.method).toBe('POST');

    const body = request.request.body as FormData;
    expect(body.get('image')).toBeTruthy();
    expect(body.get('text')).toBeNull();
    expect(body.get('audio')).toBeNull();

    request.flush({
      document_number: null,
      document_date: null,
      supplier_name: null,
      general_comment: null,
      items: [],
    });

    expect(itemCount).toBe(0);
  });

  it('отправляет только текст, если передан текст', () => {
    service.parse('  шайба сто штук  ').subscribe();

    const request = httpMock.expectOne('/api/recognition/parse');
    const body = request.request.body as FormData;

    expect(body.get('image')).toBeNull();
    expect(body.get('text')).toBe('шайба сто штук');

    request.flush({
      document_number: null,
      document_date: null,
      supplier_name: null,
      general_comment: null,
      items: [],
    });
  });

  it('не отправляет пустой текст', () => {
    service.parse('   ').subscribe();

    const request = httpMock.expectOne('/api/recognition/parse');
    const body = request.request.body as FormData;

    expect(body.get('image')).toBeNull();
    expect(body.get('text')).toBeNull();

    request.flush({
      document_number: null,
      document_date: null,
      supplier_name: null,
      general_comment: null,
      items: [],
    });
  });
});
