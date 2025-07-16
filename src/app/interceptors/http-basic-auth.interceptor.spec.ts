import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { HttpBasicAuthInterceptor } from './http-basic-auth.interceptor';

describe('HttpBasicAuthInterceptor', () => {
  let interceptor: HttpBasicAuthInterceptor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpBasicAuthInterceptor],
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
