import { TestBed } from '@angular/core/testing';

import { OwnerAddressService } from './owner-address.service';

describe('OwnerAddressService', () => {
  let service: OwnerAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
