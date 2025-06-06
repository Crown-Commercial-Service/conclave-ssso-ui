import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-manage-organisation-registration-error-not-my-organisation',
    templateUrl: './manage-organisation-registration-error-not-my-organisation.component.html',
    styleUrls: ['./manage-organisation-registration-error-not-my-organisation.component.scss'],
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
export class ManageOrgRegOrgNotFoundComponent extends BaseComponent implements OnInit {
  public buyerFlow:any
  public isCustomMfaEnabled=environment.appSetting.customMfaEnabled;
  
  constructor(private dataService: dataService,private sessionService:SessionService, private router: Router, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
    this.buyerFlow = localStorage.getItem('organisation_type') ?? '';

  }

  goBack() {
    window.history.back();
  }

  ngOnInit() { 
    this.dataLayerService.pushPageViewEvent();
  }
 

  public Onclick(buttonText:string):void{
    this.router.navigateByUrl("/manage-org/register/search")
    this.dataLayerService.pushClickEvent(buttonText)
  }
}
