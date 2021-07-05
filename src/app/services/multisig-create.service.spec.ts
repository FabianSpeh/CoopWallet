import { TestBed } from '@angular/core/testing';

import { MultisigCreateService } from './multisig-create.service';

describe('MultisigCreateService', () => {
  let service: MultisigCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultisigCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
