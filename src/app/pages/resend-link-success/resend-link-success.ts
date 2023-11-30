import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-resend-link-success',
    templateUrl: './resend-link-success.html',
    styleUrls: ['./resend-link-success.scss']
})
export class ResendLinkSuccessComponent{

    public userName: string = '';

    constructor(private activatedRoute: ActivatedRoute,private sessionService:SessionService, private authService: AuthService, private router: Router, private dataLayerService: DataLayerService) {
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.un) {
            this.userName = queryParams.un;
        }
    }
    onNavigateLinkClick(){
        this.authService.logOutAndRedirect();
    }

    ngOnInit() {
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
             event: "page_view" ,
             page_location: this.router.url.toString(),
             user_name: this.sessionService.decrypt('user_name'),
             cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
           });
        })
    }
}
