import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NomenclatureQuickAddComponent } from './nomenclature-quick-add.component';

describe('NomenclatureQuickAddComponent', () => {
  let component: NomenclatureQuickAddComponent;
  let fixture: ComponentFixture<NomenclatureQuickAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NomenclatureQuickAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NomenclatureQuickAddComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
