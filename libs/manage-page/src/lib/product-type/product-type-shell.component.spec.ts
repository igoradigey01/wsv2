import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTypeShellComponent } from './product-type-shell.component';

describe('ProductTypeShellComponent', () => {
  let component: ProductTypeShellComponent;
  let fixture: ComponentFixture<ProductTypeShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTypeShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTypeShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
