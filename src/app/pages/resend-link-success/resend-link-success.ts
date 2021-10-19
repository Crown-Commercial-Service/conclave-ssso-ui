import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-resend-link-success',
    templateUrl: './resend-link-success.html',
    styleUrls: ['./resend-link-success.scss']
})
export class ResendLinkSuccessComponent{

    public userName: string = '';

    constructor(private activatedRoute: ActivatedRoute, private authService: AuthService) {
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.un) {
            this.userName = queryParams.un;
        }
    }
    onNavigateLinkClick(){
        this.authService.logOutAndRedirect();
    }
}
