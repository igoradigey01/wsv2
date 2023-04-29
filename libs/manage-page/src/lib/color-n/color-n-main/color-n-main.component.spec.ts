import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorNMainComponent } from './color-n-main.component';

describe('ColorNMainComponent', () => {
  let component: ColorNMainComponent;
  let fixture: ComponentFixture<ColorNMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorNMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorNMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
