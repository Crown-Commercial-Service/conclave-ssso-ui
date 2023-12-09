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
        private route: ActivatedRoute, protected uiStore: Store<UIState>, private authService: AuthService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.operation = parseInt(this.route.snapshot.paramMap.get('operation') || '0');
        let operationFailedState = this.router.getCurrentNavigation()?.extras.state;
        this.userName = operationFailedState && operationFailedState['userName'] || '';
        this.messageKey = operationFailedState && operationFailedState['messageKey'] || '';
    }

    ngOnInit() {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.router.events.subscribe(value => {
        this.dataLayerService.pushEvent({ 
         event: "page_view" ,
         page_location: this.router.url.toString(),
         user_name: localStorage.getItem("user_name"),
         cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
         operation: this.operation
       });
    })
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
