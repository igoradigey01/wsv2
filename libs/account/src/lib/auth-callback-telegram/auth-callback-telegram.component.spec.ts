import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCallbackTelegramComponent } from './auth-callback-telegram.component';

describe('AuthCallbackTelegramComponent', () => {
  let component: AuthCallbackTelegramComponent;
  let fixture: ComponentFixture<AuthCallbackTelegramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthCallbackTelegramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackTelegramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
