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
  Router,
} from '@angular/router';

import { ToastService } from '../shared/toast.service';
import { PaymentPageComponent } from './payment-page.component';

const CLIENT = {
  id: 7,
  псевдоним: 'Тестовый клиент',
  фио: 'Иванов',
  телефон: '123',
  город: 'Туапсе',
  пределКредита: 1000,
  активен: true,
};

describe('PaymentPageComponent', () => {
  let fixture: ComponentFixture<PaymentPageComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let toast: ToastService;

  function setup(dealId: string | null): void {
    TestBed.configureTestingModule({
      imports: [PaymentPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '7' }),
              queryParamMap: convertToParamMap(dealId ? { dealId } : {}),
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(PaymentPageComponent);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    toast = TestBed.inject(ToastService);
    fixture.detectChanges();
  }

  function flushClientAndDeals(): void {
    httpMock.expectOne('/api/clients/7').flush(CLIENT);
    httpMock.expectOne('/api/clients/7/marks').flush([
      { id: 'd1', номер: 'R-000001', долг: 1500 },
      { id: 'd2', номер: 'R-000002', долг: 0 },
    ]);

    fixture.detectChanges();
  }

  function buttonByText(text: string): HTMLButtonElement {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll(
        'button.action',
      ) as NodeListOf<HTMLButtonElement>,
    );

    return buttons.find(
      (button) => button.textContent?.trim() === text,
    ) as HTMLButtonElement;
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('показывает клиента, сделку и долг', () => {
    setup('d1');
    flushClientAndDeals();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Тестовый клиент');
    expect(text).toContain('R-000001');
    expect(text).toContain('1,500.00');
    expect(fixture.componentInstance.deal()?.id).toBe('d1');
  });

  it('предупреждает и блокирует сохранение без сделки', () => {
    setup(null);
    flushClientAndDeals();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Сделка не выбрана');
    expect(buttonByText('Принять деньги').disabled).toBe(true);
  });

  it('подставляет весь долг в сумму', () => {
    setup('d1');
    flushClientAndDeals();

    buttonByText('Внести весь долг').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.amount()).toBe('1500.00');
  });

  it('не отправляет нулевую сумму', () => {
    setup('d1');
    flushClientAndDeals();

    buttonByText('Принять деньги').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.saveError()).toBe(
      'Сумма должна быть больше нуля.',
    );
    httpMock.expectNone('/api/clients/marks/d1/payments');
  });

  it('отправляет платёж и возвращает в карточку клиента', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.setAmount({ target: { value: '1250,50' } } as unknown as Event);
    component.setPaymentMethod({ target: { value: '2' } } as unknown as Event);
    component.setDocumentNumber({
      target: { value: '  ПКО-15  ' },
    } as unknown as Event);
    component.setComment({
      target: { value: '  Оплата по счёту  ' },
    } as unknown as Event);
    fixture.detectChanges();

    const navigate = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const show = jest.spyOn(toast, 'show');

    buttonByText('Принять деньги').click();

    const request = httpMock.expectOne('/api/clients/marks/d1/payments');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      дата: component.date(),
      сумма: 1250.5,
      способОплаты: 2,
      номерДокумента: 'ПКО-15',
      комментарий: 'Оплата по счёту',
    });

    request.flush({
      id: 130,
      дата: '2026-11-19T00:00:00',
      сумма: 1250.5,
      сделкаId: 'd1',
      способОплаты: 2,
      номерДокумента: 'ПКО-15',
      комментарий: 'Оплата по счёту',
    });

    expect(show).toHaveBeenCalledWith('Деньги приняты.');
    expect(navigate).toHaveBeenCalledWith(['/clients', 7]);
    expect(component.saving()).toBe(false);
  });

  it('показывает текст ошибки сервера', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.setAmount({ target: { value: '100' } } as unknown as Event);
    fixture.detectChanges();

    buttonByText('Принять деньги').click();

    httpMock
      .expectOne('/api/clients/marks/d1/payments')
      .flush(
        { error: 'Номер документа длиннее 30 символов.' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(component.saveError()).toBe('Номер документа длиннее 30 символов.');
  });
});
