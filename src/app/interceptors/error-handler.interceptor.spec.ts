import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { Router } from '@angular/router';

describe('ErrorHandlerInterceptor', () => {
  let interceptor: ErrorHandlerInterceptor;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ErrorHandlerInterceptor],
    });
    interceptor = TestBed.inject(ErrorHandlerInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('create an instance', () => {
    const interceptor = new ErrorHandlerInterceptor(router);

    expect(interceptor).toBeTruthy();
  });
});
