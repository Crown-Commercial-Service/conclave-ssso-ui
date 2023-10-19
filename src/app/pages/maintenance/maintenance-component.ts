import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-maintenance-component',
  templateUrl: './maintenance-component.html',
  styleUrls: ['./maintenance-component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ]
})
export class MaintenanceComponent extends BaseComponent implements OnInit {
  
  constructor(protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore,viewportScroller,scrollHelper);
  }

  ngOnInit() {
  }

}
