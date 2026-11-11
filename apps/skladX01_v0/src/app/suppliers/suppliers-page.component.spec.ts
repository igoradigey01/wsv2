import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SuppliersPageComponent } from './suppliers-page.component';

const SUPPLIERS = [
  { id: 2, название: 'Брянск', город: 'Брянск', телефон: null },
  { id: 1, название: 'Смоленск', город: 'Смоленск', телефон: '89180000000' },
];

describe('SuppliersPageComponent', () => {
  let fixture: ComponentFixture<SuppliersPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppliersPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuppliersPageComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('загружает и показывает поставщиков', () => {
    httpMock.expectOne('/api/suppliers?sort=name&dir=asc').flush(SUPPLIERS);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Брянск');
    expect(text).toContain('Смоленск');
    expect(fixture.componentInstance.suppliers().length).toBe(2);
  });

  it('переключает сортировку по названию', () => {
    httpMock.expectOne('/api/suppliers?sort=name&dir=asc').flush(SUPPLIERS);

    fixture.componentInstance.toggleSort('name');
    fixture.detectChanges();

    httpMock.expectOne('/api/suppliers?sort=name&dir=desc').flush(SUPPLIERS);
    expect(fixture.componentInstance.dir()).toBe('desc');
  });

  it('показывает сообщение, если поставщиков нет', () => {
    httpMock.expectOne('/api/suppliers?sort=name&dir=asc').flush([]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Ничего не найдено');
  });
});
