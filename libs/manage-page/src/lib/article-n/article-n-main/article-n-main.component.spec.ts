import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNMainComponent } from './article-n-main.component';

describe('ArticleNMainComponent', () => {
  let component: ArticleNMainComponent;
  let fixture: ComponentFixture<ArticleNMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleNMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleNMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
