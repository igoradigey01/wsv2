import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogOffComponent } from './log-off.component';

describe('LogOffComponent', () => {
  let component: LogOffComponent;
  let fixture: ComponentFixture<LogOffComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOffComponent ]
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
