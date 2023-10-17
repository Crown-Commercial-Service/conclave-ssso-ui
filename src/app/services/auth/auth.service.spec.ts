import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { WorkerService } from '../worker.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
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

  it('should login and redirect', () => {
    const username = 'testuser';
    const password = 'testpassword';
    const redirectUrl = 'http://example.com/authsuccess?code=testuser';

    authService.login(username, password);

    expect(window.location.href).toHaveBeenCalledWith(redirectUrl);
  });

  it('should check if user is authenticated', () => {
    localStorage.setItem('user_name', 'testuser');

    const isAuthenticated = authService.isUserAuthenticated();

    expect(isAuthenticated).toBeTrue();
  });

  it('should check if in-memory token exists', async () => {
    spyOn(authService.workerService, 'checkAccessToken').and.returnValue(
      Promise.resolve(true)
    );

    const inMemoryTokenExists = await authService.isInMemoryTokenExists();

    expect(inMemoryTokenExists).toBeTrue();
  });
});
