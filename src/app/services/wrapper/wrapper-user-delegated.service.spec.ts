import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { WrapperUserDelegatedService } from './wrapper-user-delegated.service';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/shared/session.service';
import { provideHttpClient } from '@angular/common/http';

describe('WrapperUserDelegatedService', () => {
  let service: WrapperUserDelegatedService;
  let httpMock: HttpTestingController;
  let sessionServiceMock: jasmine.SpyObj<SessionService>;

   const mockUsername = 'testuser';
  const expectedUrl = `${
    environment.uri.api.isApiGateWayEnabled
      ? environment.uri.api.wrapper.apiGatewayEnabled.user
      : environment.uri.api.wrapper.apiGatewayDisabled.user
  }?user-id=${encodeURIComponent(mockUsername)}&is-delegated=true`;

  let localStore: any = {
    user_name: 'testuser',
    isOrgAdmin: JSON.stringify(true),
  };

  beforeEach(() => {    
    sessionServiceMock = jasmine.createSpyObj('SessionService', ['decrypt']);
    sessionServiceMock.decrypt.and.returnValue(mockUsername); 

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        WrapperUserDelegatedService,
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    });
    service = TestBed.inject(WrapperUserDelegatedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('user_name');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDeligatedOrg', () => {
    it('should return delegated user data', () => {
      const mockResponse = {};

      service.getDeligatedOrg().subscribe((data) => {        
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error', () => {
      service.getDeligatedOrg().subscribe(
        () => {},
        (error) => {}
      );

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
