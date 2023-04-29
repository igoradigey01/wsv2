import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNItemComponent } from './article-n-item.component';

describe('ArticleNItemComponent', () => {
  let component: ArticleNItemComponent;
  let fixture: ComponentFixture<ArticleNItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleNItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleNItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
