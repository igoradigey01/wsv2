import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorShellComponent } from './color-shell.component';

describe('ColorShellComponent', () => {
  let component: ColorShellComponent;
  let fixture: ComponentFixture<ColorShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
