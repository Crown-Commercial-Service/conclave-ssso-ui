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

@Component({
    selector: 'app-manage-org-mfa-update-success',
    templateUrl: './manage-org-mfa-update-success.component.html',
    styleUrls: ['./manage-org-mfa-update-success.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ManageOrgMfaUpdateSuccessComponent extends BaseComponent implements OnInit {
    orgMfaSetting : string =""

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService, private wrapperUserService: WrapperUserService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
    }
    ngOnInit() {
      let queryParams =  this.activatedRoute.snapshot.queryParams;
      if (queryParams.data)
      {
        let routeData = JSON.parse(queryParams.data);
        this.orgMfaSetting = routeData;
      }

    }
    onNavigateToProfileClick(){
        this.router.navigateByUrl(`manage-org/profile`);
    }
	

}