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

@Component({
    selector: 'app-mfa-selection',
    templateUrl:'./mfa-selection.component.html',
    styleUrls: ['./mfa-selection.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MfaSelectionComponent extends BaseComponent implements OnInit {
public formValue:string ='SMS'
public orgGroup: string = 'SMS';    
authcode: string ="";
auth0token: string = "";
oob_code: any;    
qrCodeStr: string = "";
public selectedOption: string | null = null;
public orgMfaOptional:boolean = true;//need to set this from the api 

constructor(private activatedRoute: ActivatedRoute,private router:Router, private authService: AuthService,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore,viewportScroller,scrollHelper);
}

    ngOnInit() {
        
    }
    public onCancelClick()
    {

    }

    public onContinueClick(event :string | null)
    {
        //console.log(event);
        if (event == "QR")
        {
            this.router.navigateByUrl('mfa-authenticator-information');
        }
        else if (event == "MESSAGE")
        {
            this.router.navigateByUrl('mfa-message-step1');
        }
        else if (event == "NOAUTH")
        {
            this.router.navigateByUrl('no-mfa-confirmation');
        }

    }


}