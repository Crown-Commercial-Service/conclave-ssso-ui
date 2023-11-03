import { ViewportScroller } from "@angular/common";
import { AfterContentInit, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
   
    authcode: string = "";
    auth0token: string = "";
    oob_code: any;    
    qrCodeStr: string = "";
    submitted: boolean = false;
    constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
        this.formGroup = this.formBuilder.group({
            otp: [, Validators.compose([Validators.required, Validators.minLength(6)])],
          });
    }
    ngOnInit() {
        this.sendSmsOtp(this.phonenumber);
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: localStorage.getItem("user_name"),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
    }
    public onContinueBtnClick(otp: string) {
        this.submitted = true;
        this.auth0token = localStorage.getItem('auth0_token') ?? '';
        this.pushDataLayer("form_submit");
        this.authService.VerifyOTP(otp, this.auth0token, this.oob_code, "SMS").subscribe({

            next: (response) => {
                this.submitted = false;
                console.log(response);
                const authsuccessSetupUrl = environment.uri.web.dashboard + '/mfa-authentication-setup-sucess';
                window.location.href = authsuccessSetupUrl;
            },

            error: () => {
                this.formGroup.controls['otp'].setErrors({ 'incorrect': true })
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
        this.sendSmsOtp(this.phonenumber);
    }
    onReEnterPhoneNumberClick() {
        this.router.navigateByUrl('mfa-message-step-1');
    }
    sendSmsOtp(phone: string) {
        this.auth0token = localStorage.getItem('auth0_token') ?? '';
        this.pushDataLayer("form_start");
        this.authService.Associate(this.auth0token, phone, true).subscribe({
            next: (response) => {
                this.oob_code = response.oob_Code;
                localStorage.setItem('oob_code', this.oob_code)
            },
            error: () =>{} //console.log("Error"),
        });
    }

    pushDataLayer(event:string){
        this.dataLayerService.pushEvent({
            'event': event,
            'form_id': 'Check_your_phone'
        });
    }
}
