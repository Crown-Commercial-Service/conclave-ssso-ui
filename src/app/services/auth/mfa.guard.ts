import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class MfaGuard implements CanActivate {
    constructor(private router: Router) { }
    private isTwoMfaEnabled = environment.appSetting.customMfaEnabled
    public canActivate(): boolean {
        if (this.isTwoMfaEnabled) {
            return true
        }
        else {
            this.router.navigateByUrl('/home');
            return false
        }
    }

}
