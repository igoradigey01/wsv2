import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VkLoginWidgetService } from '../_shared/services/vk-login-widger.service';

import { AuthCallbackVkComponent } from './auth-callback-vk.component';

describe('AuthCallbackVkComponent', () => {
  let component: AuthCallbackVkComponent;
  let fixture: ComponentFixture<AuthCallbackVkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthCallbackVkComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        VkLoginWidgetService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackVkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
