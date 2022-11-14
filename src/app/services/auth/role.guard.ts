import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServicePermission } from 'src/app/models/servicePermission';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private isDeleagtion = environment.appSetting.hideDelegation

  constructor(public authService: AuthService, public tokenService: TokenService, private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkRole(route.data.roles);
  }

  checkRole(roles: string[]): Observable<boolean> {
    return this.authService.getPermissions('Null').pipe(map((response) => {
      for (let i = 0; i < roles.length; i++) {
        let role = roles[i];
        if((role === 'DELEGATED_ACCESS') && this.isDeleagtion){
          this.router.navigateByUrl('/home');
          return false;
        }
        if (response.some((r: ServicePermission) => r.permissionName === role)) {         
          return true;
        }
      }
      this.router.navigateByUrl('/home');
      return false;
    }));
  }
}