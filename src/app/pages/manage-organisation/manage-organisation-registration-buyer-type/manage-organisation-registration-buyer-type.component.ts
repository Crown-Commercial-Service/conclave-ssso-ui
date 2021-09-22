import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

@Component({
  selector: 'app-manage-organisation-registration-buyer-type',
  templateUrl: './manage-organisation-registration-buyer-type.component.html',
  styleUrls: ['./manage-organisation-registration-buyer-type.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrgRegBuyerTypeComponent extends BaseComponent implements OnInit {

  defaultChoice: string = "Central Government";

  constructor(private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore,viewportScroller,scrollHelper);
  }

  ngOnInit() {

  }

  public onSubmit() {
    localStorage.setItem("manage-org_buyer_type", this.defaultChoice);
    // this.router.navigateByUrl(`manage-org/register/user`);
    this.router.navigateByUrl(`manage-org/register/start`);
  }
}
