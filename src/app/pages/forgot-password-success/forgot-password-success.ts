import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/components/base/base.component';
import { dataService } from 'src/app/services/data/data.service';
import { UIState } from 'src/app/store/ui.states';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

@Component({
    selector: 'app-forget-password-success',
    templateUrl: './forgot-password-success.html',
    styleUrls: ['./forgot-password-success.scss']
})
export class ForgotPasswordSuccessComponent extends BaseComponent implements OnInit{

    public userName: string = '';

    constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore,viewportScroller,scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.un) {
            this.userName = queryParams.un;
        }
    }

    ngOnInit() {
        
    }

    onNavigateLinkClick(){
        this.authService.logOutAndRedirect();
    }
}
