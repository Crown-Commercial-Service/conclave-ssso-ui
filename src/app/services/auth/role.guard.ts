import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServicePermission } from 'src/app/models/servicePermission';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {
  private isDeleagtion = environment.appSetting.hideDelegation

  public authService = inject(AuthService);
  public tokenSerice = inject(TokenService);
  private router = inject(Router);

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
