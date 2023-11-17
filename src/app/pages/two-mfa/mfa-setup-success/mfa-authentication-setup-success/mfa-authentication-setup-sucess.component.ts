import { ViewportScroller } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { AuthService } from "src/app/services/auth/auth.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { UIState } from "src/app/store/ui.states";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-mfa-authentication-setup-sucess',
    templateUrl:'./mfa-authentication-setup-sucess.component.html',
    styleUrls: ['./mfa-authentication-setup-sucess.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MfaAuthenticationSetupSuccessComponent extends BaseComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute,private router:Router, private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
    }
    ngOnInit() {
        const homeUrl = environment.uri.web.dashboard +'/home';
                  setTimeout(() => {
                    window.location.href = homeUrl;
                  }, 5000);   
    this.router.events.subscribe(value => {
        this.dataLayerService.pushEvent({ 
            event: "page_view" ,
            page_location: this.router.url.toString(),
            user_name: localStorage.getItem("user_name"),
            cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
        });
    })
    }
    onLogOutClick()
    {
        this.authService.logOutAndRedirect();
    }

}