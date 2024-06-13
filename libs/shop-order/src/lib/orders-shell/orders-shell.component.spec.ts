import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersShellComponent } from './orders-shell.component';

describe('OrdersShellComponent', () => {
  let component: OrdersShellComponent;
  let fixture: ComponentFixture<OrdersShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
