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
    userId: number = 0;
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
        private userService: WrapperUserService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore,viewportScroller,scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            console.log(routeData);
            this.userName = routeData['userName'];
            this.userId = routeData['userId'];
        }
    }

    ngOnInit() {
    }

    onConfirmClick() {
        this.userService.resetUserPassword(this.userName, "Manage-user-account").subscribe({
            next: () => {
                let data = {
                    'userName': this.userName
                };
                this.router.navigateByUrl(`operation-success/${OperationEnum.UserPasswordChange}?data=` + JSON.stringify(data));             
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    onCancelClick(){
        let data = {
            'isEdit':true,
            'userName': this.userName
        };
        this.router.navigateByUrl('manage-users/add-user/details?data=' + JSON.stringify(data));
    }
}