import * as Rollbar from 'rollbar';
import { RollbarErrorService } from './rollbar-error.service';
import { inject, TestBed } from '@angular/core/testing';
import { RollbarService } from '../logging/rollbar';

describe('RollbarErrorService', () => {
  it('should be created', inject([RollbarErrorService], (service: RollbarErrorService) => {
    expect(service).toBeTruthy();
  }));
});
