import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from '../services/auth/auth.service';
import { WorkerService } from '../services/worker.service';
import { HttpJwtAuthInterceptor } from './http-jtw-auth.interceptor';
import { RollbarErrorService } from '../shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from '../logging/rollbar';
import { TokenService } from '../services/auth/token.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('HttpJwtAuthInterceptor', () => {
  let interceptor: HttpJwtAuthInterceptor;
  let authService: AuthService;
  let workerService: WorkerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpJwtAuthInterceptor,
        AuthService,
        WorkerService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    });

    interceptor = TestBed.inject(HttpJwtAuthInterceptor);
    authService = TestBed.inject(AuthService);
    workerService = TestBed.inject(WorkerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance', () => {
    const interceptor = new HttpJwtAuthInterceptor(workerService, authService);
    expect(interceptor).toBeTruthy();
  });
});
