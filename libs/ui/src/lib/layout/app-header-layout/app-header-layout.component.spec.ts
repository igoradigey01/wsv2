import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppHeaderLayoutComponent } from './app-header-layout.component';

describe('AppHeaderLayoutComponent', () => {
  let component: AppHeaderLayoutComponent;
  let fixture: ComponentFixture<AppHeaderLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
