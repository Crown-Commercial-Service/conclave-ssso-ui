import { TestBed, async, inject } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: jasmine
              .createSpy('isAuthenticated')
              .and.returnValue(of(true)),
            getAuthorizedEndpoint: jasmine
              .createSpy('getAuthorizedEndpoint')
              .and.returnValue('abc'),
          },
        },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should allow access when user is authenticated', async(
    inject([AuthGuard], (guard: AuthGuard) => {
      guard.canActivate().subscribe((result) => {
        expect(result).toBeTrue();
      });
    })
  ));

  it('should redirect to authorized endpoint when user is not authenticated', async(
    inject([AuthGuard], (guard: AuthGuard) => {
      authService.isAuthenticated = jasmine
        .createSpy('isAuthenticated')
        .and.returnValue(of(false));

      guard.canActivate().subscribe((result) => {
        expect(result).toBeFalse();
        expect(window.location.href).toBe('abc');
      });
    })
  ));
});
