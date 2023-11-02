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
    authcode: string = "";
    auth0token: string = "";
    oob_code: any;    
    qrCodeStr: string = "";
    showError: boolean = false;
    submitted: boolean = false;
    otpValue: string = "";
    constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, public authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        this.formGroup = this.formBuilder.group({
            otp: [, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
          });
    }

    ngOnInit() {
        this.mfaQrCode = localStorage.getItem('qr_code');

    }
    clearError() {
        this.showError = false;
    }


    public onContinueBtnClick(otp: string) {
        this.submitted = true;
        this.otpValue = otp;
        this.auth0token = localStorage.getItem('auth0_token') ?? '';
        this.authService.VerifyOTP(otp, this.auth0token, this.qrCodeStr, "QR").subscribe({

            next: (response) => {
                this.submitted = false;
                const authsuccessSetupUrl = environment.uri.web.dashboard + '/mfa-authentication-setup-sucess';
                window.location.href = authsuccessSetupUrl;
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
    }

    public async RenewToken(){
        debugger;
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
    }

    public onNavigateToMFAClick() {
        this.router.navigateByUrl('mfa-selection');
    }

    

}
