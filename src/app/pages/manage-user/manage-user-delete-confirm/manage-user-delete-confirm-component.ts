import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { OperationEnum } from "src/app/constants/enum";
import { WrapperUserService } from "src/app/services/wrapper/wrapper-user.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { ViewportScroller } from "@angular/common";
import { SessionStorageKey } from "src/app/constants/constant";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-manage-user-delete-confirm',
    templateUrl: './manage-user-delete-confirm-component.html',
    styleUrls: ['./manage-user-delete-confirm-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageUserDeleteConfirmComponent extends BaseComponent implements OnInit {
    userName: string = '';
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,private sessionService:SessionService,
        private wrapperUserService: WrapperUserService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.userName = sessionStorage.getItem(SessionStorageKey.ManageUserUserName) ?? '';
        this.userName = localStorage.getItem('ManageUserUserName') ?? '';
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }

    onDeleteConfirmClick(buttonText: string) {
        this.wrapperUserService.deleteUser(this.userName).subscribe({
            next: () => { 
                sessionStorage.setItem(SessionStorageKey.OperationSuccessUserName, this.userName);
                localStorage.setItem('OperationSuccessUserName', this.userName)
                this.router.navigateByUrl(`operation-success/${OperationEnum.UserDelete}`);             
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

    pushDataLayerEvent(buttonText: string) {
		this.dataLayerService.pushClickEvent(buttonText)
	  }
}