import { TestBed } from '@angular/core/testing';

import { ContractAbiService } from './contract-abi.service';

describe('ContractAbiService', () => {
  let service: ContractAbiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractAbiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
