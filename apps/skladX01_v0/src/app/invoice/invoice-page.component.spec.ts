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

import { InvoicePageComponent } from './invoice-page.component';

const CLIENT = {
  id: 7,
  псевдоним: 'Тестовый клиент',
  фио: 'Иванов',
  телефон: '123',
  город: 'Туапсе',
  пределКредита: 1000,
  активен: true,
};

describe('InvoicePageComponent', () => {
  let fixture: ComponentFixture<InvoicePageComponent>;
  let httpMock: HttpTestingController;

  function setup(dealId: string | null): void {
    TestBed.configureTestingModule({
      imports: [InvoicePageComponent],
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

    fixture = TestBed.createComponent(InvoicePageComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  function flushClientAndDeals(): void {
    httpMock.expectOne('/api/clients/7').flush(CLIENT);
    httpMock.expectOne('/api/clients/7/marks').flush([
      { id: 'd1', номер: 'R-000001', долг: 0 },
      { id: 'd2', номер: 'R-000002', долг: 0 },
    ]);

    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('показывает клиента и выбранную сделку', () => {
    setup('d2');
    flushClientAndDeals();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Тестовый клиент');
    expect(text).toContain('R-000002');
    expect(fixture.componentInstance.deal()?.id).toBe('d2');
  });

  it('предупреждает, если сделка не выбрана', () => {
    setup(null);
    flushClientAndDeals();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Сделка не выбрана');
  });

  it('считает итог по строке и добавляет новые строки', () => {
    setup('d1');
    flushClientAndDeals();

    const component = fixture.componentInstance;
    component.setRowQty(1, { target: { value: '3' } } as unknown as Event);
    component.setRowPrice(1, { target: { value: '100' } } as unknown as Event);
    fixture.detectChanges();

    expect(component.total()).toBe(300);

    component.addRow();
    fixture.detectChanges();

    expect(component.rows().length).toBe(2);

    component.removeRow(component.rows()[1].id);
    fixture.detectChanges();

    expect(component.rows().length).toBe(1);
  });
});
