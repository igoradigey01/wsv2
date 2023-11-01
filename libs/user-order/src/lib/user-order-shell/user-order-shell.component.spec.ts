import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOrderShellComponent } from './user-order-shell.component';

describe('UserOrderShellComponent', () => {
  let component: UserOrderShellComponent;
  let fixture: ComponentFixture<UserOrderShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOrderShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOrderShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
