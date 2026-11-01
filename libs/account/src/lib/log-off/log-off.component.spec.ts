import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

import { LogOffComponent } from './log-off.component';

describe('LogOffComponent', () => {
  let component: LogOffComponent;
  let fixture: ComponentFixture<LogOffComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOffComponent ],
      providers: [
        provideRouter([]),
        { provide: SocialAuthService, useValue: { signOut: () => Promise.resolve() } },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
