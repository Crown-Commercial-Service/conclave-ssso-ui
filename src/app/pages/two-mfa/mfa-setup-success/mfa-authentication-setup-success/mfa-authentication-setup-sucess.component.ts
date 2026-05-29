import { ViewportScroller } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { AuthService } from "src/app/services/auth/auth.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";
import { UIState } from "src/app/store/ui.states";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-mfa-authentication-setup-sucess',
    templateUrl: './mfa-authentication-setup-sucess.component.html',
    styleUrls: ['./mfa-authentication-setup-sucess.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class MfaAuthenticationSetupSuccessComponent extends BaseComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute,private router:Router,private sessionService:SessionService, private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
    }
    ngOnInit() {
        const homeUrl = this.getDashboardOrigin() + '/home';
                  setTimeout(() => {
                    window.location.href = homeUrl;
                  }, 5000);   
        this.dataLayerService.pushPageViewEvent();
    }

    private getDashboardOrigin() {
        if (typeof window !== 'undefined' && window.location?.origin) {
            return window.location.origin;
        }

        const storedRedirectUri = localStorage.getItem('redirect_uri');
        if (storedRedirectUri) {
            try {
                return new URL(storedRedirectUri).origin;
            } catch {
                // Ignore invalid URL and use configured fallback.
            }
        }

        return environment.uri.web.dashboard;
    }

    onLogOutClick()
    {
        this.authService.logOutAndRedirect();
    }

}