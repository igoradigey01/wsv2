import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomenclatureKatalogComponent } from './nomenclature-katalog.component';

describe('NomenclatureKatalogComponent', () => {
  let component: NomenclatureKatalogComponent;
  let fixture: ComponentFixture<NomenclatureKatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomenclatureKatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomenclatureKatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
