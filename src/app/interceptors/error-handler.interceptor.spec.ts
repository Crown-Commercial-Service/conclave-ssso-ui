import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { throwError, of } from 'rxjs';

import { ErrorHandlerInterceptor } from './error-handler.interceptor';

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

  it('should handle HttpResponse', () => {
    const request = new HttpRequest('GET', '/api/data');
    const response = new HttpResponse({ body: { message: 'Success' } });

    interceptor
      .intercept(request, <HttpHandler>{
        handle: () => of(response),
      })
      .subscribe((event: any) => {
        expect(event).toEqual(response);
      });

    const testRequest = httpMock.expectOne('/api/data');
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(response);
  });

  it('should handle HttpErrorResponse with status 400 and error "ERROR_INVALID_INPUT_CHARACTER"', () => {
    const request = new HttpRequest('GET', '/api/data');
    const errorResponse = new HttpErrorResponse({
      status: 400,
      error: 'ERROR_INVALID_INPUT_CHARACTER',
      statusText: 'Bad Request',
    });

    spyOn(router, 'navigateByUrl');

    interceptor
      .intercept(request, <HttpHandler>{
        handle: () => throwError(errorResponse),
      })
      .subscribe(null, (error: HttpErrorResponse) => {
        expect(error).toEqual(errorResponse);
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          'error?error_description=ERROR_INVALID_INPUT_CHARACTER'
        );
      });

    const testRequest = httpMock.expectOne('/api/data');
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(null, { status: 400, statusText: 'Bad Request' });
  });
});
