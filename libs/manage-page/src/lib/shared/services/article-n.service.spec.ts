import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ArticleNService } from './article-n.service';

describe('ArticleNService', () => {
  let service: ArticleNService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [{ provide: ArticleNService, useClass: ArticleNService }, provideHttpClient()],
  });
    service = TestBed.inject(ArticleNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
