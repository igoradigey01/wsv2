import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubCatalogComponent } from './sub-catalog.component';

describe('SubCatalogComponent', () => {
  let component: SubCatalogComponent;
  let fixture: ComponentFixture<SubCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCatalogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
