import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router,NavigationStart } from '@angular/router';
import { Store } from '@ngrx/store';
import { timeout } from 'rxjs/operators';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { Data } from 'src/app/models/data';
import { dataService } from 'src/app/services/data/data.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { UIState } from 'src/app/store/ui.states';

@Component({
    selector: 'app-manage-organisation-registration-error-empty-address-details',
    templateUrl: './manage-organisation-registration-error-empty-address-details.component.html',
    styleUrls: ['./manage-organisation-registration-error-empty-address-details.component.scss'],
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
export class ManageOrgRegErrorAddressDetailsComponent extends BaseComponent implements OnInit {
  public buyerFlow:any
  constructor(private dataService: dataService, private router: Router,private sessionService:SessionService,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore,viewportScroller,scrollHelper);
    this.buyerFlow = localStorage.getItem('organisation_type') ?? '';
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Check if it's a back navigation (e.g., triggered by the back button)
        if (event.navigationTrigger === 'popstate') {
          this.router.navigateByUrl("manage-org/register/search");
        }
      }
    });
    this.dataLayerService.pushPageViewEvent();
   }

}
