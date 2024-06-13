import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogShellComponent } from './catalog-shell.component';

describe('CatalogShellComponent', () => {
  let component: CatalogShellComponent;
  let fixture: ComponentFixture<CatalogShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
