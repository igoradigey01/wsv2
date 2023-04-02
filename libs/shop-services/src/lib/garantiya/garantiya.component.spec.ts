import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarantiyaComponent } from './garantiya.component';

describe('GarantiyaComponent', () => {
  let component: GarantiyaComponent;
  let fixture: ComponentFixture<GarantiyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GarantiyaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GarantiyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
