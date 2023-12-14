import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { OperationEnum } from "src/app/constants/enum";
import { ViewportScroller } from "@angular/common";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { WrapperUserService } from "src/app/services/wrapper/wrapper-user.service";
import { SessionStorageKey } from "src/app/constants/constant";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-manage-user-confirm-reset-password',
    templateUrl: './manage-user-confirm-reset-password-component.html',
    styleUrls: ['./manage-user-confirm-reset-password-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageUserConfirmResetPasswordComponent extends BaseComponent implements OnInit {
    userName: string = '';
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,private sessionService:SessionService,
        private userService: WrapperUserService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.userName = sessionStorage.getItem("manage_user_username") ?? '';
    }

    ngOnInit() {
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: this.sessionService.decrypt('user_name'),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
    }

    onConfirmClick() {
        this.userService.resetUserPassword(this.userName, "Manage-user-account").subscribe({
            next: () => {
                sessionStorage.setItem(SessionStorageKey.OperationSuccessUserName, this.userName);
                this.router.navigateByUrl(`operation-success/${OperationEnum.UserPasswordChange}`);             
            },
            error: (error) => {
                console.log(error);
            }
        });
        this.pushDataLayerEvent();
    }

    onCancelClick(){
        window.history.back();
        this.pushDataLayerEvent();
    }

    pushDataLayerEvent() {
		this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "Reset Password - Manage Users"
		});
	  }
}