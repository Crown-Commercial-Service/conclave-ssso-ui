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
import { UIState } from 'src/app/store/ui.states';

@Component({
  selector: 'app-manage-organisation-registration-error-username-already-exists',
  templateUrl: './manage-organisation-registration-error-username-already-exists.component.html',
  styleUrls: ['./manage-organisation-registration-error-username-already-exists.component.scss'],
  animations: [
      slideAnimation({
          close: { 'transform': 'translateX(12.5rem)' },
          open: { left: '-12.5rem' }
      })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrgRegErrorUsernameExistsComponent extends BaseComponent implements OnInit {

  constructor(private dataService: dataService, private router: Router, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore,viewportScroller,scrollHelper);
  }

  ngOnInit() { }

  goBack(){
    window.history.back();
  }

  public goConfirmOrgPage():void{
    const schemeDetails = JSON.parse(localStorage.getItem('schemeDetails') || '');
    this.router.navigateByUrl(
      `manage-org/register/search/${schemeDetails.scheme}?id=${encodeURIComponent(
        schemeDetails.schemeID
      )}`
    );
  }
}
