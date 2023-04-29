import { TestBed } from '@angular/core/testing';

import { ColorNService } from './color-n.service';

describe('ColorNService', () => {
  let service: ColorNService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
