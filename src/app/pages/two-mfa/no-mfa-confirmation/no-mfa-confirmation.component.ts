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
    userName = localStorage.getItem('user_name') ?? ''
    constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService, private wrapperUserService: WrapperUserService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
    }
    ngOnInit() {
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: localStorage.getItem("user_name"),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
    }
    public onGoBackClick() {
        this.router.navigateByUrl('mfa-selection');
    }

    public onDontTurnOnClick() {
        this.wrapperUserService.resetMfaopted(this.userName, true).subscribe({
            next: (response) => {
                this.router.navigateByUrl('mfa-no-authentication-setup-success');

            },
            error: (err) => {
                console.log(err)
            },
        })
    }

}