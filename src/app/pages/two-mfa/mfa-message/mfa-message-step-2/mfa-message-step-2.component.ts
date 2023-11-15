import { ViewportScroller } from "@angular/common";
import { AfterContentInit, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { AuthService } from "src/app/services/auth/auth.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { UIState } from "src/app/store/ui.states";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-mfa-message-step-2',
    templateUrl: './mfa-message-step-2.component.html',
    styleUrls: ['./mfa-message-step-2.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MfaMessageStep2Component extends BaseComponent implements OnInit {
    formGroup: FormGroup;
    public phonenumber: string = localStorage.getItem('phonenumber') ?? '';
    otp: string = "";
    authcode: string = "";
    auth0token: string = "";
    oob_code: any;    
    qrCodeStr: string = "";
    submitted: boolean = false;
    errorMsg: string = "";
    isTooManySms: boolean = false;
    constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        this.formGroup = this.formBuilder.group({
            otp: [, Validators.compose([Validators.required, Validators.minLength(6)])],
          });
    }
    ngOnInit() {
        this.sendSmsOtp(this.phonenumber);
    }
    ngAfterViewInit()
    {
        document.getElementById('message-otp')?.focus();
    }
    public onContinueBtnClick(otp: string) {
        this.submitted = true;
        this.isTooManySms = false;
        this.auth0token = localStorage.getItem('auth0_token') ?? '';
        this.otp = otp;
        this.authService.VerifyOTP(otp, this.auth0token, this.oob_code, "SMS").subscribe({

            next: (response) => {
                this.submitted = false;
                this.router.navigateByUrl('/home');
            },

            error: (err) => {
                if(err.error.error_description == 'The mfa_token provided is invalid. Try getting a new token.'){
                    this.RenewToken('VERIFYOTP');
                }
                else{
                    this.formGroup.controls['otp'].setErrors({ 'incorrect': true })
                }                
            },
        
        });
    }
    public onBackBtnClick() {
        this.router.navigateByUrl('mfa-message-step-1');
    }
    public onNavigateToMFAClick() {
        this.router.navigateByUrl('mfa-selection');
    }  
    onResendOtpLinkClick() {
        if(this.isTooManySms){
            return false;
        }
        this.sendSmsOtp(this.phonenumber);
        return true;
    }
    onReEnterPhoneNumberClick() {
        this.router.navigateByUrl('mfa-message-step-1');
    }
    sendSmsOtp(phone: string) {
        this.auth0token = localStorage.getItem('auth0_token') ?? '';
        this.authService.Associate(this.auth0token, phone, true).subscribe({
            next: (response) => {
                this.oob_code = response.oob_Code;
                localStorage.setItem('oob_code', this.oob_code)
            },
            error: (err) =>{
                if(err.error.error_description == 'The mfa_token provided is invalid. Try getting a new token.'){
                    this.RenewToken('GETOTP');
                }
                else if(err.error.error_description == 'Too many SMS sent by the user. Wait for some minutes before retrying.'){
                    
                    this.errorMsg = 'You have generated too many text messages. Please try again later.';
                    this.isTooManySms = true;
                    this.submitted = false;                    
                }
            } //console.log("Error"),
        });
    }

    public async RenewToken(type:string){
        var refreshtoken = localStorage.getItem('auth0_refresh_token')+'';
        await this.authService.mfarenewtoken(refreshtoken).toPromise().then((tokeninfo) => {              
            localStorage.setItem('auth0_token', tokeninfo.access_Token);
            localStorage.setItem('auth0_refresh_token', tokeninfo.refresh_Token);
            if(type == 'GETOTP'){
                this.sendSmsOtp(this.phonenumber);
            }
            else{
                this.onContinueBtnClick(this.otp);
            }            
        },
        (err) => {
            console.log(err);
            this.authService.logOutAndRedirect();
        });
    
    }


}