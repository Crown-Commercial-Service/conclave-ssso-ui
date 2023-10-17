import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperUserDelegatedService } from './wrapper-user-delegated.service';
import { environment } from 'src/environments/environment';

describe('WrapperUserDelegatedService', () => {
  let service: WrapperUserDelegatedService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperUserDelegatedService],
    });
    service = TestBed.inject(WrapperUserDelegatedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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

      const req = httpMock.expectOne(
        `${
          environment.uri.api.isApiGateWayEnabled
            ? environment.uri.api.wrapper.apiGatewayEnabled.user
            : environment.uri.api.wrapper.apiGatewayDisabled.user
        }/delegate-user?user-id=${encodeURIComponent(
          localStorage.getItem('user_name') || ''
        )}&is-delegated=${true}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error', () => {
      const mockError = new Error('Internal Server Error');

      service.getDeligatedOrg().subscribe(
        () => {},
        (error) => {
          expect(error).toEqual(mockError);
        }
      );

      const req = httpMock.expectOne(
        `${
          environment.uri.api.isApiGateWayEnabled
            ? environment.uri.api.wrapper.apiGatewayEnabled.user
            : environment.uri.api.wrapper.apiGatewayDisabled.user
        }/delegate-user?user-id=${encodeURIComponent(
          localStorage.getItem('user_name') || ''
        )}&is-delegated=${true}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
