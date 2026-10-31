import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrandShellComponent } from './brand-shell.component';

describe('BrandShellComponent', () => {
  let component: BrandShellComponent;
  let fixture: ComponentFixture<BrandShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [BrandShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
