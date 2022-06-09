import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServicePermission } from 'src/app/models/servicePermission';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(public authService: AuthService, public tokenService: TokenService, private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkRole(route.data.roles);
  }

  checkRole(roles: string[]): Observable<boolean> {
    return this.authService.getPermissions('Null').pipe(map((response) => {
      for (let i = 0; i < roles.length; i++) {
        let role = roles[i];
        if (response.some((r: ServicePermission) => r.permissionName === role)) {         
          return true;
        }
      }
      this.router.navigateByUrl('/home');
      return false;
    }));
  }
}
