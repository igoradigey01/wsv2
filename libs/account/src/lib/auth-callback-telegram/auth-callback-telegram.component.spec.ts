import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TelegramLoginWidgetService } from '../_shared/services/telegram-login-widget.servise';

import { AuthCallbackTelegramComponent } from './auth-callback-telegram.component';

describe('AuthCallbackTelegramComponent', () => {
  let component: AuthCallbackTelegramComponent;
  let fixture: ComponentFixture<AuthCallbackTelegramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthCallbackTelegramComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        TelegramLoginWidgetService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackTelegramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
