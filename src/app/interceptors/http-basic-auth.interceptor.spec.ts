import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HttpBasicAuthInterceptor } from './http-basic-auth.interceptor';

describe('HttpBasicAuthInterceptor', () => {
  let interceptor: HttpBasicAuthInterceptor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpBasicAuthInterceptor],
    });

    interceptor = TestBed.inject(HttpBasicAuthInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('create an instance', () => {
    const interceptor = new HttpBasicAuthInterceptor();
    expect(interceptor).toBeTruthy();
  });
});
