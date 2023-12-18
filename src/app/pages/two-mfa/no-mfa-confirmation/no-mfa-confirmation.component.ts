import { ViewportScroller } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { AuthService } from "src/app/services/auth/auth.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { UIState } from "src/app/store/ui.states";
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { DataLayerService } from "src/app/shared/data-layer.service";
import { environment } from "src/environments/environment";
import { SessionService } from "src/app/shared/session.service";


@Component({
    selector: 'app-no-mfa-confirmation',
    templateUrl: './no-mfa-confirmation.component.html',
    styleUrls: ['./no-mfa-confirmation.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
})
export class NoMfaConfiramtionComponent extends BaseComponent implements OnInit {
    userName = this.sessionService.decrypt('user_name')
    public isMfaOpted : boolean = false;
    public isDormanted : boolean = false;
    constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService, private wrapperUserService: WrapperUserService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService,private sessionService:SessionService) {
        super(uiStore, viewportScroller, scrollHelper);
    }
    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }
    public onGoBackClick() {
        this.router.navigateByUrl('mfa-selection');
        this.pushDataLayerEvent();
    }

    public onDontTurnOnClick() {
        this.wrapperUserService.resetMfaopted(this.userName, true).subscribe({
            next: (response) => {
                this.isMfaOpted = true;
                localStorage.setItem('mfa_opted',JSON.stringify(this.isMfaOpted));
                this.router.navigateByUrl('/home');

            },
            error: (err) => {
                    if(err.error=='ERROR_USER_IN_DORMANTED_STATE'){
                    this.isDormanted=true;
                    localStorage.setItem('isDormant', JSON.stringify(this.isDormanted));
                    this.router.navigateByUrl('dormancy-message');
               }
              console.log(err)
            },
        })
        this.pushDataLayerEvent();
    }

    pushDataLayerEvent() {
		this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "no-mfa-confirmation"
		});
	  }
}
