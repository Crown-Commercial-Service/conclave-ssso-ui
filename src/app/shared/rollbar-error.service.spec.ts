import { TestBed } from '@angular/core/testing';
import Rollbar from 'rollbar';
import { environment } from 'src/environments/environment';
import { RollbarErrorService } from './rollbar-error.service';
import { RollbarService } from '../logging/rollbar';

describe('RollbarErrorService', () => {
  let rollbarErrorService: RollbarErrorService;
  let rollbar: jasmine.SpyObj<Rollbar>;

  beforeEach(() => {
    const rollbarSpy = jasmine.createSpyObj('Rollbar', ['configure', 'debug']);

    TestBed.configureTestingModule({
      providers: [
        RollbarErrorService,
        { provide: RollbarService, useValue: rollbarSpy },
      ],
    });

    rollbarErrorService = TestBed.inject(RollbarErrorService);
    rollbar = TestBed.inject(RollbarService) as jasmine.SpyObj<Rollbar>;
  });

  it('should not call rollbar.debug() when security_log is false', () => {
    rollbarErrorService.RollbarDebug('Test data');

    expect(rollbar.configure).not.toHaveBeenCalled();
    expect(rollbar.debug).not.toHaveBeenCalled();
  });

  it('should not call rollbar.debug() when security_log is false for rollBarHttp()', () => {
    rollbarErrorService.rollBarHttp('Test data');

    expect(rollbar.configure).not.toHaveBeenCalled();
    expect(rollbar.debug).not.toHaveBeenCalled();
  });
});
