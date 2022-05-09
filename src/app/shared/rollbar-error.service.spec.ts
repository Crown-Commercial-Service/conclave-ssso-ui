import { TestBed } from '@angular/core/testing';

import { RollbarErrorService } from './rollbar-error.service';

describe('RollbarErrorService', () => {
  let service: RollbarErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RollbarErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
