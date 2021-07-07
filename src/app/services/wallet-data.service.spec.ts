import { TestBed } from '@angular/core/testing';

import { WalletDataService } from './wallet-data.service';

describe('WalletDataService', () => {
  let service: WalletDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
