import { ViewportScroller } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { AuthService } from "src/app/services/auth/auth.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { UIState } from "src/app/store/ui.states";

@Component({
    selector: 'app-mfa-authenticator-information',
    templateUrl:'./mfa-authenticator-information.component.html',
    styleUrls: ['./mfa-authenticator-information.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MfaInformationComponent extends BaseComponent implements OnInit{
    auth0token: string = "";
    refreshtoken: string = "";
    qrCodeStr: string = "";

    constructor(private activatedRoute: ActivatedRoute, private router: Router,private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore,viewportScroller,scrollHelper);
    }
    ngOnInit()
    {
        
    }
    public onNavigateToMFAClick()
    {
         
      this.router.navigateByUrl('mfa-selection');
    }
    public onContinueBtnClick()
    {
      this.getQRCode();
     // this.router.navigateByUrl('mfa-authenticator-setup');
    }
    public onBackBtnClick()
    {
      this.router.navigateByUrl('mfa-selection');
    }
    getQRCode () : any {
      this.auth0token = localStorage.getItem('auth0_token') ?? '';
      this.authService.Associate(this.auth0token,"",false).subscribe({
          next : (response) => {
            localStorage.setItem('qr_code',response.barcode_Uri);
            localStorage.setItem('secret_code',response.secret);
            this.router.navigateByUrl('mfa-authenticator-setup');

          }, error : (err) => {
            console.log(err);
            if (err.status == 404) {
              this.router.navigateByUrl('error?error_description=USER_NOT_FOUND');
          }
          else if (err.error == 'INVALID_CONNECTION') {
              this.router.navigateByUrl('error?error_description=INVALID_CONNECTION');
          }          
          else if(err.error.error_description == 'The mfa_token provided is invalid. Try getting a new token.'){
              this.RenewToken();
          }
          else {
              this.authService.logOutAndRedirect();
          }
          }     

      });
  }

  public async RenewToken(){
    this.refreshtoken = localStorage.getItem('auth0_refresh_token')+'';
    await this.authService.mfarenewtoken(this.refreshtoken).toPromise().then((tokeninfo) => {              
        localStorage.setItem('auth0_token', tokeninfo.access_Token);
        localStorage.setItem('auth0_refresh_token', tokeninfo.refresh_Token);
        this.getQRCode();
    },
    (err) => {
        console.log(err);
        this.authService.logOutAndRedirect();
    });

}

}
