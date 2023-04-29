import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomenclatureMainComponent } from './nomenclature-main.component';

describe('NomenclatureMainComponent', () => {
  let component: NomenclatureMainComponent;
  let fixture: ComponentFixture<NomenclatureMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomenclatureMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomenclatureMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
