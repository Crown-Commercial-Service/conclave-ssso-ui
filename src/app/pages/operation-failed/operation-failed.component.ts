import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-operation-failed',
    templateUrl: './operation-failed.component.html',
    styleUrls: ['./operation-failed.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class OperationFailedComponent extends BaseComponent implements OnInit {
    operation : OperationEnum;
    operationEnum = OperationEnum;
    userName: string;
    messageKey: string;
    public isOrgAdmin: boolean = false;

    constructor(private router: Router,
        private route: ActivatedRoute, protected uiStore: Store<UIState>,private sessionService:SessionService, private authService: AuthService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.operation = parseInt(this.route.snapshot.paramMap.get('operation') || '0');
        let operationFailedState = this.router.getCurrentNavigation()?.extras.state;
        this.userName = operationFailedState && operationFailedState['userName'] || '';
        this.messageKey = operationFailedState && operationFailedState['messageKey'] || '';
    }

    ngOnInit() {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.dataLayerService.pushPageViewEvent({operation: this.operation});
    }

    public onNavigateToSignInClick(){
        this.authService.logOutAndRedirect();
    }

    onNavigateToManageUserClick(){
        this.router.navigateByUrl("manage-users");
    }

    goBack():void{
        window.history.back()
    }
}
