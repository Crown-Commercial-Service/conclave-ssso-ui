import { TestBed } from '@angular/core/testing';
import { RollbarErrorService } from './rollbar-error.service';
import { RollbarService } from '../logging/rollbar';
import { environment } from '../../environments/environment';

describe('RollbarErrorService', () => {
  let service: RollbarErrorService;
  let rollbarServiceMock: any;

  beforeEach(() => {
    rollbarServiceMock = {
      configure: jasmine.createSpy('configure'),
      debug: jasmine.createSpy('debug'),
    };

    TestBed.configureTestingModule({
      providers: [
        RollbarErrorService,
        { provide: RollbarService, useValue: rollbarServiceMock },
      ],
    });

    service = TestBed.inject(RollbarErrorService);
  });

  it('should configure Rollbar with the correct log level and environment when calling RollbarDebug', () => {
    spyOnProperty(environment, 'rollbar').and.returnValue({
      security_log: true,
      environment: 'test',
    });
    const data = 'Some debug data';

    service.RollbarDebug(data);

    expect(rollbarServiceMock.configure).toHaveBeenCalledWith({
      logLevel: 'info',
      payload: { environment: 'test' },
    });
    expect(rollbarServiceMock.debug).toHaveBeenCalledWith(data);
  });

  it('should configure Rollbar with the correct log level and environment when calling rollBarHttp', () => {
    spyOnProperty(environment, 'rollbar').and.returnValue({
      security_log: true,
      environment: 'test',
    });
    const data = 'Some HTTP data';

    service.rollBarHttp(data);

    expect(rollbarServiceMock.configure).toHaveBeenCalledWith({
      logLevel: 'info',
      payload: { environment: 'test' },
    });
    expect(rollbarServiceMock.debug).toHaveBeenCalledWith(data);
  });

  it('should not configure Rollbar or call debug when security_log is false', () => {
    spyOnProperty(environment, 'rollbar').and.returnValue({
      security_log: false,
    });
    const data = 'Some data';

    service.RollbarDebug(data);
    service.rollBarHttp(data);

    expect(rollbarServiceMock.configure).not.toHaveBeenCalled();
    expect(rollbarServiceMock.debug).not.toHaveBeenCalled();
  });
});
