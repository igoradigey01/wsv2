import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OplataIDostavkaComponent } from './oplata-i-dostavka.component';

describe('OplataIDostavkaComponent', () => {
  let component: OplataIDostavkaComponent;
  let fixture: ComponentFixture<OplataIDostavkaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OplataIDostavkaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OplataIDostavkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
