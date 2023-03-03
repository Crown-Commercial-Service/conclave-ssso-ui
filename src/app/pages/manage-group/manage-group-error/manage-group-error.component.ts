import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, Self } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { timeout } from 'rxjs/operators';
import * as _ from 'lodash';

import { BaseComponent } from 'src/app/components/base/base.component';
import { Data } from 'src/app/models/data';
import { dataService } from 'src/app/services/data/data.service';
import { UIState } from 'src/app/store/ui.states';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenInfo } from 'src/app/models/auth';
import { TokenService } from 'src/app/services/auth/token.service';
import { environment } from 'src/environments/environment';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';

@Component({
    templateUrl: './manage-group-error.component.html',
    styleUrls: ['./manage-group-error.component.scss']
})
export class ManageGroupErrorComponent extends BaseComponent {

    editingGroupId: number = 0;
    routeData: any = {};
    public showRoleView:boolean = environment.appSetting.hideSimplifyRole

    constructor(private activatedRoute: ActivatedRoute,private router: Router, protected uiStore: Store<UIState>,private authService: AuthService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore,viewportScroller,scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            this.routeData = JSON.parse(queryParams.data);
            this.editingGroupId = this.routeData['groupId'];
        }
    }

    navigateBackToGroups() {
        let data = {
            'isEdit': true,
            'groupId': this.editingGroupId
        };
        this.router.navigateByUrl('manage-groups/view?data=' + JSON.stringify(data));
    }
}
