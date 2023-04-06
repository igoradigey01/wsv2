import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KakZakazatComponent } from './kak-zakazat.component';

describe('KakZakazatComponent', () => {
  let component: KakZakazatComponent;
  let fixture: ComponentFixture<KakZakazatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KakZakazatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KakZakazatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
