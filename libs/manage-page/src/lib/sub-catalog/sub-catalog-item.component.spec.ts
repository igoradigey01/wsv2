import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubCatalogItemComponent } from './sub-catalog-item.component';

describe('SubCatalogItemComponent', () => {
  let component: SubCatalogItemComponent;
  let fixture: ComponentFixture<SubCatalogItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCatalogItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCatalogItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
