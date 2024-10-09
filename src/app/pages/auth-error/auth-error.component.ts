import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { TokenService } from 'src/app/services/auth/token.service';
import { TokenInfo } from 'src/app/models/auth';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WorkerService } from 'src/app/services/worker.service';
import { GlobalRouteService } from 'src/app/services/helper/global-route.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';


@Component({
    selector: 'app-auth-error',
    templateUrl: './auth-error.component.html'
})
export class AuthErrorComponent extends BaseComponent implements OnInit {

    constructor(private globalRouteService: GlobalRouteService,
        private route: ActivatedRoute,
        private authService: AuthService,
        protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,
        private router: Router,
        private dataLayerService: DataLayerService,
        private sessionService: SessionService
    ) {
        super(uiStore, viewportScroller, scrollHelper);
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();

        if(this.globalRouteService.globalRoute.indexOf("isEdit") < 0 && this.globalRouteService.globalRoute.indexOf("mfareset") < 0
            && this.globalRouteService.globalRoute.indexOf("isNewTab") < 0){
            this.authService.renewAccessToken(this.globalRouteService.globalRoute.length > 0 ?
                this.globalRouteService.globalRoute : 'home');
        }
        else{
            this.authService.useTokenFromStorage();
            let url = this.globalRouteService.globalRoute.length > 0 ? this.globalRouteService.globalRoute : 'home';
            if (url.includes('isNewTab=true')) {
                const urlTree = this.router.parseUrl(url);
               if (urlTree.queryParams) {          
                    delete urlTree.queryParams['isNewTab'];
                    url = urlTree.toString();
                }
            }
            this.router.navigateByUrl(url, { replaceUrl: true });
        }
    }
}
