import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth/auth.service';
import { WorkerService } from '../services/worker.service';
import { HttpJwtAuthInterceptor } from './http-jtw-auth.interceptor';
import { of } from 'rxjs';

describe('HttpJwtAuthInterceptor', () => {
  let interceptor: HttpJwtAuthInterceptor;
  let workerService: WorkerService;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpJwtAuthInterceptor, WorkerService, AuthService],
    });

    interceptor = TestBed.inject(HttpJwtAuthInterceptor);
    workerService = TestBed.inject(WorkerService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add authorization header with bearer token', () => {
    const mockToken = 'mock-token';
    spyOn(workerService, 'getAccessToken').and.returnValue(of(mockToken));

    const mockRequest = httpMock.expectOne('http://localhost:3000/api/test');
    expect(mockRequest.request.headers.has('Authorization')).toBeFalsy();

    interceptor.intercept(mockRequest.request, httpMock);

    expect(mockRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(mockRequest.request.headers.get('Authorization')).toEqual(
      `Bearer ${mockToken}`
    );
  });

  it('should not add authorization header if token is empty', () => {
    spyOn(workerService, 'getAccessToken').and.returnValue(of(''));

    const mockRequest = httpMock.expectOne('http://localhost:3000/api/test');
    expect(mockRequest.request.headers.has('Authorization')).toBeFalsy();

    interceptor.intercept(mockRequest.request, httpMock);

    expect(mockRequest.request.headers.has('Authorization')).toBeFalsy();
  });

  it('should add X-XSRF-TOKEN header with cookie value', () => {
    spyOn(workerService, 'getAccessToken').and.returnValue(of(''));

    document.cookie = 'XSRF-TOKEN=mock-cookie';

    const mockRequest = httpMock.expectOne('http://localhost:3000/api/test');
    expect(mockRequest.request.headers.has('X-XSRF-TOKEN')).toBeFalsy();

    interceptor.intercept(mockRequest.request, httpMock);

    expect(mockRequest.request.headers.has('X-XSRF-TOKEN')).toBeTruthy();
    expect(mockRequest.request.headers.get('X-XSRF-TOKEN')).toEqual(
      'mock-cookie'
    );
  });

  it('should remove Content-Type header for multipart/form-data requests', () => {
    spyOn(workerService, 'getAccessToken').and.returnValue(of(''));

    const mockRequest = httpMock.expectOne('http://localhost:3000/api/test');
    mockRequest.request.headers.set('Content-Type', 'multipart/form-data');

    interceptor.intercept(mockRequest.request, httpMock);

    expect(mockRequest.request.headers.has('Content-Type')).toBeFalsy();
  });

  it('should add Content-Type header for requests without it', () => {
    spyOn(workerService, 'getAccessToken').and.returnValue(of(''));

    const mockRequest = httpMock.expectOne('http://localhost:3000/api/test');
    mockRequest.request.headers.delete('Content-Type');

    interceptor.intercept(mockRequest.request, httpMock);

    expect(mockRequest.request.headers.has('Content-Type')).toBeTruthy();
    expect(mockRequest.request.headers.get('Content-Type')).toEqual(
      'application/json'
    );
  });

  it('should handle 401 error by logging out and redirecting', () => {
    spyOn(workerService, 'getAccessToken').and.returnValue(of(''));
    spyOn(authService, 'logOutAndRedirect');

    const mockRequest = httpMock.expectOne('http://localhost:3000/api/test');
    mockRequest.flush('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(authService.logOutAndRedirect).toHaveBeenCalled();
  });
});
