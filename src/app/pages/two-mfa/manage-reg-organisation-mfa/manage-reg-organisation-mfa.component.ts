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
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-manage-reg-organisation-mfa',
    templateUrl:'./manage-reg-organisation-mfa.component.html',
    styleUrls: ['./manage-reg-organisation-mfa.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrgRegMfaComponent extends BaseComponent implements OnInit {

constructor(private activatedRoute: ActivatedRoute,private sessionService:SessionService,private router:Router, private authService: AuthService,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore,viewportScroller,scrollHelper);
}
   selectedOption: string = "required";
    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }
    public onContinueClick(option :string | null)
    {
        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgReginfo = orgInfoExists
          ? JSON.parse(sessionStorage.getItem('orgreginfo') || '')
          : '';
          orgReginfo.isMfaRequired = (option === "optional") ? false : true;
        sessionStorage.setItem('orgreginfo', JSON.stringify(orgReginfo));
        this.router.navigateByUrl(`manage-org/register/type`);
        this.dataLayerService.pushClickEvent('Continue');
    }
}