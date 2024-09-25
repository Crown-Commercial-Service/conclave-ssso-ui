import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class MfaGuard  {
  
    private router = inject(Router);
    private authService = inject(AuthService);
   
    public canActivate(): Observable<boolean> {
    
        return this.authService.isAuthenticated().pipe(
          map((isAuth) => {
            const mfaOptedString: string | null = localStorage.getItem('mfa_opted');
            const mfaOpted: boolean = mfaOptedString ? JSON.parse(mfaOptedString) : false;
            var isMaintenance = environment.appSetting.isMaintenance;
            var isTwoMfaEnabled = environment.appSetting.customMfaEnabled;
            if(isMaintenance){
              window.location.href = 'maintenance';     
              return false;
            }
            if ((mfaOpted && isAuth) ||(!isTwoMfaEnabled)) 
            {
              this.authService.logOutAndRedirect();
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
