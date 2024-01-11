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
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
        private userService: WrapperUserService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.userName = sessionStorage.getItem("manage_user_username") ?? '';
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }

    onConfirmClick(buttonText:string) {
        this.userService.resetUserPassword(this.userName, "Manage-user-account").subscribe({
            next: () => {
                sessionStorage.setItem(SessionStorageKey.OperationSuccessUserName, this.userName);
                this.router.navigateByUrl(`operation-success/${OperationEnum.UserPasswordChange}`);             
            },
            error: (error) => {
                console.log(error);
            }
        });
        this.pushDataLayerEvent(buttonText);
    }

    onCancelClick(buttonText: string){
        window.history.back();
        this.pushDataLayerEvent(buttonText);
    }

    pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText)
	  }
}