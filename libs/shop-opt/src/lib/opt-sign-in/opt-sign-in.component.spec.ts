import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OptSignInComponent } from './opt-sign-in.component';

describe('OptSignInComponent', () => {
  let component: OptSignInComponent;
  let fixture: ComponentFixture<OptSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptSignInComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OptSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
