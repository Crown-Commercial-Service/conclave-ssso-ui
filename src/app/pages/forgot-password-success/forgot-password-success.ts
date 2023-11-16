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

@Component({
    selector: 'app-forget-password-success',
    templateUrl: './forgot-password-success.html',
    styleUrls: ['./forgot-password-success.scss']
})
export class ForgotPasswordSuccessComponent extends BaseComponent implements OnInit{

    public userName: string = '';

    constructor(private activatedRoute: ActivatedRoute, public authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private router: Router, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.userName = sessionStorage.getItem(SessionStorageKey.ForgotPasswordUserName) ?? "";
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

    onNavigateLinkClick(){
        this.authService.logOutAndRedirect();
    }

    ngOnDestroy(){
        sessionStorage.removeItem(SessionStorageKey.ForgotPasswordUserName);
    }
}
