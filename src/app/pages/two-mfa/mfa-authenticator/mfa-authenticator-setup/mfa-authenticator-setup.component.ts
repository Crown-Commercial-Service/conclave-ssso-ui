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

@Component({
    selector: 'app-mfa-authenticator-setup',
    templateUrl:'./mfa-authenticator-setup.component.html',
    styleUrls: ['./mfa-authenticator-setup.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MfaAuthenticatorSetupComponent extends BaseComponent implements OnInit , AfterContentInit {
    formGroup: FormGroup;
    public myAngularxQrCode: any = localStorage.getItem('qr_code');
   
    authcode: string ="";
    auth0token: string = "";
    oob_code: any;    
    qrCodeStr: string = "";
    constructor(private activatedRoute: ActivatedRoute ,private formBuilder: FormBuilder , private router: Router,private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore,viewportScroller,scrollHelper);
        this.formGroup = this.formBuilder.group({
            otp: [, Validators.compose([Validators.required,Validators.minLength(6)])],
          });
    }
    ngOnInit()
    {
        
    }
   public onContinueBtnClick()
    {
     // redirect to dashboard home
    }
    public onBackBtnClick()
    {
        this.router.navigateByUrl('mfa-authenticator-information');
    }
    ngAfterContentInit(){

    }
    public  onNavigateToMFAClick()
    {
        this.router.navigateByUrl('mfa-selection');
    }

    

}
