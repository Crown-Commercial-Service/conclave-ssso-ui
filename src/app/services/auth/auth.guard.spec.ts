import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getAuthorizedEndpoint',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy}
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });
  
  it('should return true if the user is authenticated and MFA is opted', (done) => {
    authService.isAuthenticated.and.returnValue(of(true));
    localStorage.setItem('mfa_opted', JSON.stringify(true));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should navigate to "force-logout" if MFA is not opted and user is authenticated', (done) => {
    authService.isAuthenticated.and.returnValue(of(true));
    localStorage.setItem('mfa_opted', JSON.stringify(false));
    
    guard.canActivate().subscribe((result) => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('force-logout');
      expect(result).toBe(false);
      done();
    });
  });
 
});
