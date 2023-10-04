import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoadingIndicatorInterceptor } from './loading-indicator.interceptor';
import { LoadingIndicatorService } from '../services/helper/loading-indicator.service';
import { environment } from '../../environments/environment';

describe('LoadingIndicatorInterceptor', () => {
  let interceptor: LoadingIndicatorInterceptor;
  let httpMock: HttpTestingController;
  let loadingIndicatorService: LoadingIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoadingIndicatorInterceptor, LoadingIndicatorService],
    });
    interceptor = TestBed.inject(LoadingIndicatorInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
    loadingIndicatorService = TestBed.inject(LoadingIndicatorService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not show loading indicator for excluded URLs when show_loading_indicator is false', () => {
    localStorage.setItem('show_loading_indicator', 'false');

    const excludedUrls = [
      `${environment.uri.api.security}/security/authorize`,
      `${environment.uri.api.security}/security/token`,
      `${environment.uri.api.postgres}/auth/refresh-tokens`,
      `${environment.uri.api.postgres}/authorization/sessions`,
      `${environment.uri.api.postgres}/organisations/orgs-by-name`,
    ];

    excludedUrls.forEach((url) => {
      const request = httpMock.expectOne(url);
      expect(request.request.method).toBe('GET');
      request.flush({});

      expect(loadingIndicatorService.isLoading.value).toBe(false);
    });
  });

  it('should show loading indicator for non-excluded URLs when show_loading_indicator is false', () => {
    localStorage.setItem('show_loading_indicator', 'false');

    const nonExcludedUrl = 'https://example.com/api/data';

    const request = httpMock.expectOne(nonExcludedUrl);
    expect(request.request.method).toBe('GET');
    request.flush({});

    expect(loadingIndicatorService.isLoading.value).toBe(true);
  });

  it('should show loading indicator for all URLs when show_loading_indicator is true', () => {
    localStorage.setItem('show_loading_indicator', 'true');

    const urls = [
      `${environment.uri.api.security}/security/authorize`,
      `${environment.uri.api.security}/security/token`,
      `${environment.uri.api.postgres}/auth/refresh-tokens`,
      `${environment.uri.api.postgres}/authorization/sessions`,
      `${environment.uri.api.postgres}/organisations/orgs-by-name`,
      'https://example.com/api/data',
    ];

    urls.forEach((url) => {
      const request = httpMock.expectOne(url);
      expect(request.request.method).toBe('GET');
      request.flush({});

      expect(loadingIndicatorService.isLoading.value).toBe(true);
    });
  });

  it('should remove completed requests from the requests array', () => {
    localStorage.setItem('show_loading_indicator', 'true');

    const url = 'https://example.com/api/data';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush({});

    expect(interceptor['requests'].length).toBe(0);
  });

  it('should remove cancelled requests from the requests array', () => {
    localStorage.setItem('show_loading_indicator', 'true');

    const url = 'https://example.com/api/data';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.error(new ErrorEvent('error'));

    expect(interceptor['requests'].length).toBe(0);
  });

  it('should handle errors and remove requests from the requests array', () => {
    localStorage.setItem('show_loading_indicator', 'true');

    const url = 'https://example.com/api/data';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(interceptor['requests'].length).toBe(0);
  });

  it('should intercept HTTP requests and add them to the requests array', () => {
    localStorage.setItem('show_loading_indicator', 'true');

    const url = 'https://example.com/api/data';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');

    expect(interceptor['requests'].length).toBe(1);
    expect(loadingIndicatorService.isLoading.value).toBe(true);
  });

  it('should create and return an Observable for HTTP requests', () => {
    localStorage.setItem('show_loading_indicator', 'true');

    const url = 'https://example.com/api/data';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('should handle and propagate complete events', () => {
    localStorage.setItem('show_loading_indicator', 'true');

    const url = 'https://example.com/api/data';
    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush({});
  });
});
