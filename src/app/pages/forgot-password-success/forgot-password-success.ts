import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/components/base/base.component';
import { dataService } from 'src/app/services/data/data.service';
import { UIState } from 'src/app/store/ui.states';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SessionStorageKey } from 'src/app/constants/constant';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-forget-password-success',
    templateUrl: './forgot-password-success.html',
    styleUrls: ['./forgot-password-success.scss']
})
export class ForgotPasswordSuccessComponent extends BaseComponent implements OnInit{

    public userName: string = '';

    constructor(private activatedRoute: ActivatedRoute, public authService: AuthService,private sessionService:SessionService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private router: Router, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.userName = sessionStorage.getItem(SessionStorageKey.ForgotPasswordUserName) ?? "";
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }

    onNavigateLinkClick(){
        this.authService.logOutAndRedirect();
    }

    ngOnDestroy(){
        sessionStorage.removeItem(SessionStorageKey.ForgotPasswordUserName);
    }
}
