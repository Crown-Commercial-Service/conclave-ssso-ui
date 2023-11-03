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
    qrCodeStr: string = "";

    constructor(private activatedRoute: ActivatedRoute, private router: Router,private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
    }
    ngOnInit()
    {
      this.router.events.subscribe(value => {
        this.dataLayerService.pushEvent({ 
            event: "page_view" ,
            page_location: this.router.url.toString(),
            user_name: localStorage.getItem("user_name"),
            cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
        });
      })
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
            this.router.navigateByUrl('mfa-authenticator-setup');

          }, error : () => {}//console.log("Error"),       

      });
  }

}
