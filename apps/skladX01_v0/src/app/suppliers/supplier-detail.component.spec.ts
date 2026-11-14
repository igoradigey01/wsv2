import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { of } from 'rxjs';

import { SupplierDetailComponent } from './supplier-detail.component';

const SUPPLIER = {
  id: 2,
  название: 'Брянск',
  город: 'Брянск',
  телефон: '89180000000',
};

describe('SupplierDetailComponent', () => {
  let fixture: ComponentFixture<SupplierDetailComponent>;
  let httpMock: HttpTestingController;

  function setup(id: string, narrow = false): void {
    TestBed.configureTestingModule({
      imports: [SupplierDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id }) },
          },
        },
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: narrow, breakpoints: {} }) },
        },
      ],
    });

    fixture = TestBed.createComponent(SupplierDetailComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  function flushSupplier(): void {
    httpMock.expectOne('/api/suppliers/2').flush(SUPPLIER);
    fixture.detectChanges();
  }

  it('показывает шапку поставщика и ссылку на приход', () => {
    setup('2');
    flushSupplier();

    const element = fixture.nativeElement as HTMLElement;
    const text = element.textContent as string;

    expect(text).toContain('Брянск');
    expect(text).toContain('89180000000');

    const receiptLink = element.querySelector(
      'a[href="/suppliers/2/receipt/new"]',
    );
    expect(receiptLink).toBeTruthy();
  });

  it('на узком экране объединяет блоки во вкладки', () => {
    setup('2', true);
    flushSupplier();

    const element = fixture.nativeElement as HTMLElement;
    const tabs = element.querySelectorAll('app-tabs [role="tab"]');

    expect(tabs.length).toBe(2);
    expect(tabs[0].textContent).toContain('Полученный товар');
    expect(tabs[1].textContent).toContain('Отданные деньги');
    expect(element.querySelectorAll('.tabs__panel section.block').length).toBe(
      1,
    );
  });

  it('на широком экране показывает оба блока одновременно', () => {
    setup('2');
    flushSupplier();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-tabs')).toBeNull();
    expect(element.querySelectorAll('.blocks > section.block').length).toBe(2);
  });

  it('показывает «Поставщик не найден» при 404', () => {
    setup('2');

    httpMock
      .expectOne('/api/suppliers/2')
      .flush('', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(fixture.componentInstance.notFound()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Поставщик не найден');
  });
});
