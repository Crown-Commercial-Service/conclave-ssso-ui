import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperUserService } from './wrapper-user.service';
import { environment } from 'src/environments/environment';

describe('WrapperUserService', () => {
  let service: WrapperUserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperUserService],
    });
    service = TestBed.inject(WrapperUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create user', () => {
    const userRequest = {
      detail: {
        id: 1,
      },
      userName: 'test user',
      organisationId: '123',
      title: 'test title',
      firstName: 'test',
      lastName: 'user',
      mfaEnabled: true,
      isAdminUser: false,
    };

    service.createUser(userRequest).subscribe((data) => {
      expect(data).toBeTruthy();
    });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.user
        : environment.uri.api.wrapper.apiGatewayDisabled.user
    }/v1`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
