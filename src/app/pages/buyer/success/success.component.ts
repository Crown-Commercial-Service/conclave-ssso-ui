import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-buyer-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyerSuccessComponent extends BaseComponent implements OnInit {

  constructor(protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private router: Router, private dataLayerService: DataLayerService) {
    super(uiStore,viewportScroller,scrollHelper);
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
}
