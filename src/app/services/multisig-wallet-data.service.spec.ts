import { TestBed } from '@angular/core/testing';

import { MultisigWalletDataService } from './multisig-wallet-data.service';

describe('MultisigWalletDataService', () => {
  let service: MultisigWalletDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultisigWalletDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
