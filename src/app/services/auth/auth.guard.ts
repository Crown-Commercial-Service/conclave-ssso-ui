import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService,private router:Router) { }

  public canActivate(): Observable<boolean> {
    
    return this.authService.isAuthenticated().pipe(
      map((isAuth) => {
        const mfaOptedString: string | null = localStorage.getItem('mfa_opted');
        const mfaOpted: boolean = mfaOptedString ? JSON.parse(mfaOptedString) : false;
        var isMaintenance = environment.appSetting.isMaintenance;
        if(isMaintenance){
          window.location.href = 'maintenance';     
          return false;
        }
        if (!mfaOpted && isAuth) 
        {
           //this.authService.logOutAndRedirect();
           this.router.navigateByUrl('force-logout');
          return false;
        }
        if (!isAuth) {       
          window.location.href = this.authService.getAuthorizedEndpoint();
          return false;
        }
        return true;
      })
    );
  }
}
