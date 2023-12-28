import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class DormancyGuard implements CanActivate {
    constructor(private router: Router,private authService :AuthService) { }
   
    public  canActivate(): Observable<boolean> {
        return this.authService.isAuthenticated().pipe(
          map((isAuth) => {
            const isDormantedstring: string | null = localStorage.getItem('isDormant');
            const isDormant: boolean = isDormantedstring ? JSON.parse(isDormantedstring) : false;
            if (isDormant) 
            {
              this.router.navigateByUrl('dormancy-message');
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
