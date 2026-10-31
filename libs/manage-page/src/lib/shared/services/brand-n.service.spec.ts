import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { BrandNService } from './brand-n.service';

describe('BrandNService', () => {
  let service: BrandNService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [{ provide: BrandNService, useClass: BrandNService }, provideHttpClient()],
  });
    service = TestBed.inject(BrandNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
