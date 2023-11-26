import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubCatalogShellComponent } from './sub-catalog-shell.component';

describe('SubCatalogShellComponent', () => {
  let component: SubCatalogShellComponent;
  let fixture: ComponentFixture<SubCatalogShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCatalogShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCatalogShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
