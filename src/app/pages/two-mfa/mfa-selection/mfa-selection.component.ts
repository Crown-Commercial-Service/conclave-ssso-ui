import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { UIState } from "src/app/store/ui.states";
import { Store } from "@ngrx/store";
import { WorkerService } from "src/app/services/worker.service";
import { TokenService } from "src/app/services/auth/token.service";
import { ViewportScroller } from "@angular/common";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { TokenInfo } from "src/app/models/auth";
import { HelperService } from "src/app/shared/helper.service";

@Component({
    selector: 'app-mfa-selection',
    templateUrl: './mfa-selection.component.html',
    styleUrls: ['./mfa-selection.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MfaSelectionComponent extends BaseComponent implements OnInit {
    public formValue: string = 'SMS'
public orgGroup: string = 'SMS';    
    authcode: string = "";
auth0token: string = "";
oob_code: any;    
qrCodeStr: string = "";
public selectedOption: string | null = null;
    public orgMfaOptional: boolean = true;//need to set this from the api 

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService,private helperService : HelperService,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
}

    ngOnInit() {
        this.selectedOption = this.helperService.getSelectedOption();
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['code']) {
                this.authService.mfatoken(params['code']).toPromise().then((tokeninfo: TokenInfo) => {
                    this.auth0token = tokeninfo.auth0_access_token;
                    localStorage.setItem('auth0_token', this.auth0token);
                }, (err) => {
                    if (err.status == 404) {
                        this.router.navigateByUrl('error?error_description=USER_NOT_FOUND');
                    }
                    else if (err.error == 'INVALID_CONNECTION') {
                        this.router.navigateByUrl('error?error_description=INVALID_CONNECTION');
                    }
                    else if (err.error == 'MFA_NOT_VERIFIED') {
                        this.router.navigateByUrl('error?error_description=PENDING_MFA_VERIFICATION');
                    }
                    else {
                        this.authService.logOutAndRedirect();
                    }
        
                });
    }
            else if (params['error']) {
                let error = params['error'];
                if (error == 'login_required') {
                    this.authService.logOutAndRedirect();
                }
                else if (error = 'unauthorized') {
                    //go to error page
                    let errorMessage = params['error_description'];
                    this.router.navigateByUrl('error?error_description=' + errorMessage);
                }
            }

        });

    }
    public onCancelClick() {
        this.authService.logOutAndRedirect();
    }

    public onContinueClick(event: string | null) {
        this.helperService.setSelectedOption(event);

        if (event == "QR") {
            this.router.navigateByUrl('mfa-authenticator-information');
        }
        else if (event == "MESSAGE") {
            this.router.navigateByUrl('mfa-message-step-1');
        }
        else if (event == "NOAUTH") {
            this.router.navigateByUrl('no-mfa-confirmation');
        }

    }


}