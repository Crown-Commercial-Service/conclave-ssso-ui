import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { TokenService } from 'src/app/services/auth/token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        AuthGuard,
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);

    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: '',
    });
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(true));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
    });
  });

  it('should redirect to authorized endpoint if user is not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(false));
    spyOn(authService, 'getAuthorizedEndpoint').and.returnValue('/login');

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      expect(window.location.href).toBe('/login');
    });
  });
});
