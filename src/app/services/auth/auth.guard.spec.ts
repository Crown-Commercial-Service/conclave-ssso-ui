import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from './token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
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
  });

  it('should allow navigation if user is authenticated', (done) => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(true));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to authorized endpoint if user is not authenticated', (done) => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(false));
    spyOn(authService, 'getAuthorizedEndpoint').and.returnValue(
      'https://example.com/authorize'
    );

    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: 'https://example.com/authorize',
      configurable: true,
    });

    // spyOnProperty(window.location, 'href', 'get').and.returnValue(
    //   'https://example.com/authorize'
    // );

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });
});
