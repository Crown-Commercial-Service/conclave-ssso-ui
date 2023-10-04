import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpRequest,
} from '@angular/common/http';
import { HttpBasicAuthInterceptor } from './http-basic-auth.interceptor';

describe('HttpBasicAuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpBasicAuthInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add Authorization header with base64 encoded credentials', () => {
    const testUrl = 'https://example.com/api/test';
    const expectedHeaders = {
      Accept: 'application/json',
      Authorization: 'Basic Y29nbml0bzpuN3U1SzlSTA==',
    };

    httpClient.get(testUrl).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpTestingController.expectOne(
      (req: HttpRequest<any>) => {
        return req.url === testUrl && req.headers.has('Authorization');
      }
    );

    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toEqual(
      expectedHeaders.Authorization
    );

    httpRequest.flush({});
  });
});
