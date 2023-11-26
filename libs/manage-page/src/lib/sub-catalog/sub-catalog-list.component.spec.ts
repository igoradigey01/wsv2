import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubCatalogListComponent } from './sub-catalog-list.component';

describe('SubCatalogListComponent', () => {
  let component: SubCatalogListComponent;
  let fixture: ComponentFixture<SubCatalogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCatalogListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCatalogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
