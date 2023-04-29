import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomenclatureCategoriaComponent } from './nomenclature-categoria.component';

describe('NomenclatureCategoriaComponent', () => {
  let component: NomenclatureCategoriaComponent;
  let fixture: ComponentFixture<NomenclatureCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomenclatureCategoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomenclatureCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
