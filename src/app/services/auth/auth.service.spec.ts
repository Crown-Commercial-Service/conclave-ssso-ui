import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { WorkerService } from '../worker.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { environment } from '../../../environments/environment';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        TokenService,
        WorkerService,
        RollbarErrorService,
        Location,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should check if user is authenticated', () => {
    localStorage.setItem('user_name', 'testuser');

    const isAuthenticated = authService.isUserAuthenticated();

    expect(isAuthenticated).toBe(true);
  });

  it('should check if in-memory token exists', async(() => {
    spyOn(authService.workerService, 'checkAccessToken').and.returnValue(
      Promise.resolve(true)
    );

    authService.isInMemoryTokenExists().then((result) => {
      expect(result).toBe(true);
    });
  }));
});
