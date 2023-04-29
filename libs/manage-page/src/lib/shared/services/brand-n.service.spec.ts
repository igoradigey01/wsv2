import { TestBed } from '@angular/core/testing';

import { BrandNService } from './brand-n.service';

describe('BrandNService', () => {
  let service: BrandNService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
