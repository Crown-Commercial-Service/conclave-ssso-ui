import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {   

  private authService = inject(AuthService);
  private router = inject(Router);
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
