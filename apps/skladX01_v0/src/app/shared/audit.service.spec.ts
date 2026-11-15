import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuditService } from './audit.service';
import { actionLabel, paymentSums } from './audit.models';
import type { IAuditEntry } from './audit.models';

describe('AuditService', () => {
  let service: AuditService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuditService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('запрашивает историю с типом, id и limit', () => {
    service.getHistory('invoice', 1201, 10).subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/api/audit/invoice/1201' &&
        request.params.get('limit') === '10',
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('переводит поля ответа в модель', () => {
    let entries: IAuditEntry[] = [];

    service
      .getHistory('payment', 20)
      .subscribe((value) => (entries = value));

    httpMock.expectOne('/api/audit/payment/20?limit=50').flush([
      {
        id: 3,
        entityType: 'Payment',
        entityId: 20,
        action: 'Update',
        changedByEmployeeId: 1,
        changedByEmployeeName: 'Сидорова Мария Ивановна',
        timestamp: '2026-11-15T10:12:33Z',
        oldData: '{"sum":1000}',
        newData: '{"sum":1200}',
      },
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].employeeName).toBe('Сидорова Мария Ивановна');
    expect(entries[0].employeeId).toBe(1);
    expect(entries[0].oldData).toBe('{"sum":1000}');
  });

  it('подписывает действия по-русски', () => {
    expect(actionLabel('Update')).toBe('Изменение');
    expect(actionLabel('Something')).toBe('Something');
  });

  it('достаёт старую и новую сумму из JSON', () => {
    expect(paymentSums('{"sum":1000.00}', '{"sum":1200}')).toEqual({
      before: 1000,
      after: 1200,
    });
    expect(paymentSums(null, 'не json')).toEqual({ before: null, after: null });
  });
});
