import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArticleShellComponent } from './article-shell.component';

describe('ArticleShellComponent', () => {
  let component: ArticleShellComponent;
  let fixture: ComponentFixture<ArticleShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [ArticleShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
