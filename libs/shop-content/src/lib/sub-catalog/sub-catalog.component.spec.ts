import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SubCatalogComponent } from './sub-catalog.component';

describe('SubCatalogComponent', () => {
  let component: SubCatalogComponent;
  let fixture: ComponentFixture<SubCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
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
