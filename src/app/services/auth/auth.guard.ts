import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService) { }

  public canActivate(): Observable<boolean> {
    
    return this.authService.isAuthenticated().pipe(
      map((isAuth) => {
        var isMaintenance = environment.appSetting.isMaintenance;
        if(isMaintenance){
          window.location.href = 'maintenance';     
          return false;
        }
        if (!isAuth) {       
          window.location.href = this.authService.getAuthorizedEndpoint();
          return false;
          // return true;
        }
        return true;
      })
    );
  }
}
