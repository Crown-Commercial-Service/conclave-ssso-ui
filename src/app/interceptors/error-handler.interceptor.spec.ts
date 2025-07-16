import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('ErrorHandlerInterceptor', () => {
  let interceptor: ErrorHandlerInterceptor;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ErrorHandlerInterceptor,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
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
