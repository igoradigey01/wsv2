import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ColorNService } from './color-n.service';

describe('ColorNService', () => {
  let service: ColorNService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [{ provide: ColorNService, useClass: ColorNService }, provideHttpClient()],
  });
    service = TestBed.inject(ColorNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
