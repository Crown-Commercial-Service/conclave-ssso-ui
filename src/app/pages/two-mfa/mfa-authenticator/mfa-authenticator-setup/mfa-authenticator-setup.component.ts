import { ViewportScroller } from "@angular/common";
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { timeout } from "rxjs/operators";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { AuthService } from "src/app/services/auth/auth.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";
import { UIState } from "src/app/store/ui.states";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-mfa-authenticator-setup',
    templateUrl: './mfa-authenticator-setup.component.html',
    styleUrls: ['./mfa-authenticator-setup.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MfaAuthenticatorSetupComponent extends BaseComponent implements OnInit {
    formGroup: FormGroup;
    public mfaQrCode: any = localStorage.getItem('qr_code');
    public secretCode : string | null = localStorage.getItem('secret_code');
    public isMfaOpted : boolean = false;
    authcode: string = "";
    auth0token: string = "";
    oob_code: any;    
    qrCodeStr: string = "";
    showError: boolean = false;
    submitted: boolean = false;
    otpValue: string = "";
    constructor(private activatedRoute: ActivatedRoute,private sessionService:SessionService, private formBuilder: FormBuilder, private router: Router, public authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
        this.formGroup = this.formBuilder.group({
            otp: [, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
          });
    }

    ngOnInit() {
        this.mfaQrCode = localStorage.getItem('qr_code');
        this.secretCode = localStorage.getItem('secret_code');
        this.pushDataLayer("form_start");
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: this.sessionService.decrypt('user_name'),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
    }
    // ngAfterViewInit()
    // {
    //     document.getElementById('authenticator-otp')?.focus();
    // }
    clearError() {
        this.showError = false;
    }


    public onContinueBtnClick(otp: string) {
        this.submitted = true;
        this.otpValue = otp;
        this.auth0token = localStorage.getItem('auth0_token') ?? '';
        this.pushDataLayer("form_submit");
        this.authService.VerifyOTP(otp, this.auth0token, this.qrCodeStr, "QR").subscribe({

            next: (response) => {
                this.submitted = false;
                this.isMfaOpted = true;
                localStorage.setItem('mfa_opted',JSON.stringify(this.isMfaOpted));
                this.router.navigateByUrl('/home');
            },
        
            error: (err) => {
                if(err.error.error_description == 'The mfa_token provided is invalid. Try getting a new token.'){
                    this.RenewToken();
                }
                else{
                    // this.showError = true;
                    this.formGroup.controls['otp'].setErrors({ 'incorrect': true })
                }
                
    }

        });
        this.pushDataLayerEvent();
    }

    public async RenewToken(){
        var refreshtoken = localStorage.getItem('auth0_refresh_token')+'';
        await this.authService.mfarenewtoken(refreshtoken).toPromise().then((tokeninfo) => {              
            localStorage.setItem('auth0_token', tokeninfo.access_Token);
            localStorage.setItem('auth0_refresh_token', tokeninfo.refresh_Token);     
            this.onContinueBtnClick(this.otpValue);       
        },
        (err) => {
            console.log(err);
            this.authService.logOutAndRedirect();
        });
    
    }

    public onBackBtnClick() {
        this.router.navigateByUrl('mfa-authenticator-information');
        this.pushDataLayerEvent();
    }

    pushDataLayerEvent() {
		this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "Set up an app"
		});
	  }

    public onNavigateToMFAClick() {
        this.router.navigateByUrl('mfa-selection');
    }

    pushDataLayer(event:string){
        this.dataLayerService.pushEvent({
            'event': event,
            'form_id': 'Set_up_your_app Use_your_authenticator_app_to_scan_the_QR_code.'
        });
    }
}