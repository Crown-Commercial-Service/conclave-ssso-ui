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
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";


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
    public authcode: string = "";
    public auth0token: string = "";
    public oob_code: any;
    public qrCodeStr: string = "";
    public selectedOption: string | null = null;
    public orgMfaRequired: boolean = false;
    public ciiOrgId : string = "";
    public isLoaded :boolean = false


    constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService, private helperService: HelperService,
        private wrapperOrganisationService : WrapperOrganisationService,private sessionService:SessionService, private tokenService : TokenService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
    }

     async ngOnInit() {
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: this.sessionService.decrypt('user_name'),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
       // this.orgMfaRequired = JSON.parse(localStorage.getItem('org_mfa_required') || 'false');
       await this.GetOrganisationMfaSettings();
        this.selectedOption = this.helperService.getSelectedOption();
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['code']) {
                this.authService.mfatoken(params['code']).toPromise().then((tokeninfo: TokenInfo) => {
                    this.auth0token = tokeninfo.auth0_access_token;
                    localStorage.setItem('auth0_token', this.auth0token);
                    localStorage.setItem('auth0_refresh_token', tokeninfo.auth0_refresh_token);
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
                    else if(err.error_description == 'The mfa_token provided is invalid. Try getting a new token.'){
                        this.RenewToken();
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
        this.pushDataLayerEvent();
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
        this.pushDataLayerEvent();
    }

    pushDataLayerEvent() {
		this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "MFA Selection"
		});
	}

    public async GetOrganisationMfaSettings() {
        this.ciiOrgId = this.tokenService.getCiiOrgId();
        await this.wrapperOrganisationService.getOrganisationMfaStatus(this.ciiOrgId).toPromise().then((data: any) => {
            this.orgMfaRequired = data.toLowerCase() === 'true';
            this.isLoaded = true;

        })
        .catch((err) =>
        {
            console.log('error', err); 
        });

    }

    public async RenewToken(){
        let token = localStorage.getItem('auth0_refresh_token')+'';
        await this.authService.mfarenewtoken(token).toPromise().then((tokeninfo) => {            
            localStorage.setItem('auth0_token', tokeninfo.access_Token);
            localStorage.setItem('auth0_refresh_token', tokeninfo.refresh_Token);
        },
        (err) => {
            console.log(err);
            this.authService.logOutAndRedirect();
        });

    }


}