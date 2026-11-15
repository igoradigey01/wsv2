import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordEditDialogComponent } from './record-edit-dialog.component';
import type { IRecordSaved } from './record-edit-dialog.component';
import { ToastService } from '../shared/toast.service';

describe('RecordEditDialogComponent', () => {
  let httpMock: HttpTestingController;

  function setup(
    kind: 'product' | 'payment',
    amount = 100,
  ): ComponentFixture<RecordEditDialogComponent> {
    TestBed.configureTestingModule({
      imports: [RecordEditDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const fixture = TestBed.createComponent(RecordEditDialogComponent);
    fixture.componentRef.setInput('dealId', 'd1');
    fixture.componentRef.setInput('kind', kind);
    fixture.componentRef.setInput('recordId', kind === 'payment' ? 20 : 10);
    fixture.componentRef.setInput('title', 'Накладная №5');
    fixture.componentRef.setInput('amount', amount);

    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    return fixture;
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('загружает строки накладной и историю при открытии', () => {
    const fixture = setup('product');

    httpMock.expectOne('/api/clients/marks/d1/products/10/rows').flush([
      {
        id: 1,
        номенклатураId: 5,
        номенклатура: 'Болт М12',
        количество: 2,
        цена: 100,
        сумма: 200,
      },
    ]);
    httpMock.expectOne('/api/audit/invoice/10?limit=50').flush([]);

    fixture.detectChanges();

    expect(fixture.componentInstance.rows()).toHaveLength(1);
    expect(fixture.componentInstance.total()).toBe(200);
    expect(fixture.nativeElement.textContent).toContain('Болт М12');
    expect(fixture.nativeElement.textContent).toContain('200.00');
  });

  it('сохраняет строки, обновляет историю и показывает тост', () => {
    const fixture = setup('product');
    const saved: IRecordSaved[] = [];
    fixture.componentInstance.saved.subscribe((value) => saved.push(value));

    httpMock.expectOne('/api/clients/marks/d1/products/10/rows').flush([
      {
        id: 1,
        номенклатураId: 5,
        номенклатура: 'Болт М12',
        количество: 2,
        цена: 100,
        сумма: 200,
      },
    ]);
    httpMock.expectOne('/api/audit/invoice/10?limit=50').flush([]);
    fixture.detectChanges();

    const quantity = fixture.nativeElement.querySelector(
      'table.rows tbody tr input',
    ) as HTMLInputElement;
    quantity.value = '3.5';
    quantity.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.total()).toBe(350);

    const saveButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Сохранить'));
    saveButton?.click();

    const put = httpMock.expectOne({
      method: 'PUT',
      url: '/api/clients/marks/d1/products/10',
    });
    expect(put.request.body).toEqual({
      строки: [{ id: 1, количество: 3.5, цена: 100 }],
    });

    put.flush([
      {
        id: 1,
        номенклатураId: 5,
        номенклатура: 'Болт М12',
        количество: 3.5,
        цена: 100,
        сумма: 350,
      },
    ]);
    httpMock.expectOne('/api/audit/invoice/10?limit=50').flush([]);

    fixture.detectChanges();

    expect(saved).toEqual([{ kind: 'product', id: 10, amount: 350 }]);
    expect(fixture.componentInstance.total()).toBe(350);
    expect(TestBed.inject(ToastService).toast()?.message).toBe(
      'Строки накладной сохранены.',
    );
  });

  it('не даёт сохранить строку с нулевым количеством', () => {
    const fixture = setup('product');

    httpMock.expectOne('/api/clients/marks/d1/products/10/rows').flush([
      {
        id: 1,
        номенклатураId: 5,
        номенклатура: 'Болт М12',
        количество: 2,
        цена: 100,
        сумма: 200,
      },
    ]);
    httpMock.expectOne('/api/audit/invoice/10?limit=50').flush([]);
    fixture.detectChanges();

    fixture.componentInstance.setQuantity(1, {
      target: { value: '0' },
    } as unknown as Event);
    fixture.detectChanges();

    expect(fixture.componentInstance.invalid()).toBe(true);
    fixture.componentInstance.save();

    httpMock.expectNone({
      method: 'PUT',
      url: '/api/clients/marks/d1/products/10',
    });
  });

  it('сохраняет сумму платежа и обновляет историю', () => {
    const fixture = setup('payment', 1000);
    const saved: IRecordSaved[] = [];
    fixture.componentInstance.saved.subscribe((value) => saved.push(value));

    httpMock.expectOne('/api/audit/payment/20?limit=50').flush([]);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input[type="number"]',
    ) as HTMLInputElement;
    input.value = '1200';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const saveButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Сохранить'));
    saveButton?.click();

    const put = httpMock.expectOne({
      method: 'PUT',
      url: '/api/clients/marks/d1/payments/20',
    });
    expect(put.request.body).toEqual({ сумма: 1200 });

    put.flush({
      id: 20,
      дата: '2026-11-01T10:00:00',
      сумма: 1200,
      сделкаId: 'd1',
    });
    httpMock.expectOne('/api/audit/payment/20?limit=50').flush([]);

    fixture.detectChanges();

    expect(saved).toEqual([{ kind: 'payment', id: 20, amount: 1200 }]);
    expect(TestBed.inject(ToastService).toast()?.message).toBe(
      'Сумма платежа сохранена.',
    );
  });

  it('показывает историю изменений с суммой платежа', () => {
    const fixture = setup('payment', 1200);

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
    fixture.detectChanges();

    const historyTab = Array.from(
      fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>,
    ).find((tab) => tab.textContent?.includes('История'));
    historyTab?.click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Сидорова Мария Ивановна');
    expect(text).toContain('Изменение');
    expect(text).toContain('1,000.00');
    expect(text).toContain('1,200.00');
    expect(text).toContain('{"sum":1000}');
  });

  it('сообщает о пустой истории', () => {
    const fixture = setup('product');

    httpMock.expectOne('/api/clients/marks/d1/products/10/rows').flush([]);
    httpMock.expectOne('/api/audit/invoice/10?limit=50').flush([]);
    fixture.detectChanges();

    fixture.componentInstance.setTab('history');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'История изменений пуста',
    );
  });

  it('показывает ошибку загрузки истории и повторяет запрос', () => {
    const fixture = setup('payment', 100);

    httpMock
      .expectOne('/api/audit/payment/20?limit=50')
      .flush('', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    fixture.componentInstance.setTab('history');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Не удалось загрузить историю изменений',
    );

    const retry = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Повторить'));
    retry?.click();

    httpMock.expectOne('/api/audit/payment/20?limit=50').flush([]);
  });

  it('закрывается по Esc', () => {
    const fixture = setup('payment', 100);
    const closed: boolean[] = [];
    fixture.componentInstance.closed.subscribe(() => closed.push(true));

    httpMock.expectOne('/api/audit/payment/20?limit=50').flush([]);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closed).toHaveLength(1);
  });
});
