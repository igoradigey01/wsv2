import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ColorShellComponent } from './color-shell.component';

describe('ColorShellComponent', () => {
  let component: ColorShellComponent;
  let fixture: ComponentFixture<ColorShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [ColorShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
