import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-org-support-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class OrgSupportErrorComponent extends BaseComponent implements OnInit {
  errorCode: string = "";
  contactUrl = environment.uri.ccsContactUrl;

  constructor(protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,private sessionService:SessionService, private activatedRoute: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams) {
      this.errorCode = queryParams['errCode'] || "";
    }
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
   }
}
