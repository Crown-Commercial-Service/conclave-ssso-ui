import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { LoadingIndicatorService } from '../services/helper/loading-indicator.service';
import { LoadingIndicatorInterceptor } from './loading-indicator.interceptor';

import { BehaviorSubject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

class LoadingIndicatorServiceMock {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
}

describe('LoadingIndicatorInterceptor', () => {
  let httpMock: HttpTestingController;
  let loadingIndicatorService: LoadingIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LoadingIndicatorService, LoadingIndicatorInterceptor],
    });

    httpMock = TestBed.inject(HttpTestingController);
    loadingIndicatorService = TestBed.inject(LoadingIndicatorService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('create an instance', () => {
    const loadingIndicatorServiceMock = new LoadingIndicatorService();

    const interceptor = new LoadingIndicatorInterceptor(
      loadingIndicatorServiceMock
    );
    expect(interceptor).toBeTruthy();
  });
});
