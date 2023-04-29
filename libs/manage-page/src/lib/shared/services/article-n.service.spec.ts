import { TestBed } from '@angular/core/testing';

import { ArticleNService } from './article-n.service';

describe('ArticleNService', () => {
  let service: ArticleNService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
