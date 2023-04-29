import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorNItemComponent } from './color-n-item.component';

describe('ColorNItemComponent', () => {
  let component: ColorNItemComponent;
  let fixture: ComponentFixture<ColorNItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorNItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorNItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
