import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { NomenclatureService } from './nomenclature.service';
import { CategoriaNService } from './categoria-n.service';
import { KatalogNService } from './katalog-n.service';
import { ArticleNService } from './article-n.service';
import { BrandNService } from './brand-n.service';
import { ColorNService } from './color-n.service';

describe('NomenclatureService', () => {
  let service: NomenclatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
      { provide: NomenclatureService, useClass: NomenclatureService },
      CategoriaNService,
      KatalogNService,
      ArticleNService,
      BrandNService,
      ColorNService,
      provideHttpClient(),
    ],
  });
    service = TestBed.inject(NomenclatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
