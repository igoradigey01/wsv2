import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomenclatureItemComponent } from './nomenclature-item.component';

describe('NomenclatureItemComponent', () => {
  let component: NomenclatureItemComponent;
  let fixture: ComponentFixture<NomenclatureItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomenclatureItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomenclatureItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
