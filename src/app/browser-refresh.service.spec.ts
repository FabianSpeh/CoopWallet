import { TestBed } from '@angular/core/testing';

import { BrowserRefreshService } from './browser-refresh.service';

describe('BrowserRefreshService', () => {
  let service: BrowserRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
