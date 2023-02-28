import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCallbackVkComponent } from './auth-callback-vk.component';

describe('AuthCallbackVkComponent', () => {
  let component: AuthCallbackVkComponent;
  let fixture: ComponentFixture<AuthCallbackVkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthCallbackVkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackVkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
