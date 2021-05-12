import { TestBed } from '@angular/core/testing';

import { UserWalletDataService } from './user-wallet-data.service';

describe('UserWalletDataService', () => {
  let service: UserWalletDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWalletDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
