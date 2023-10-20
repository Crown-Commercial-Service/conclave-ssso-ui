import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { of } from 'rxjs';
import { RoleGuard } from './role.guard';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getPermissions']);
    tokenServiceSpy = jasmine.createSpyObj('TokenService', [], {
      isDeleagtion: false,
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should allow access for roles with valid permissions', () => {
    const mockPermissions = [
      { permissionName: 'ROLE_ONE' },
      { permissionName: 'ROLE_TWO' },
    ];
    authServiceSpy.getPermissions.and.returnValue(of(mockPermissions));

    const canActivate = guard.canActivate(
      { data: { roles: ['DELEGATED_ACCESS'] } } as any,
      <RouterStateSnapshot>{}
    );

    canActivate.subscribe((result) => {
      expect(result).toBeFalse();
      expect(authServiceSpy.getPermissions).toHaveBeenCalled();
    });
  });

  it('should redirect to "/home" for roles without valid permissions', () => {
    authServiceSpy.getPermissions.and.returnValue(
      of([{ permissionName: 'OTHER_ROLE' }])
    );

    const canActivate = guard.canActivate(
      { data: { roles: ['DELEGATED_ACCESS'] } } as any,
      <RouterStateSnapshot>{}
    );

    canActivate.subscribe((result) => {
      expect(result).toBeFalse();
      expect(authServiceSpy.getPermissions).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/home');
    });
  });
});
