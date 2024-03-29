import { ViewportScroller } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

import { getSideNavVisible } from 'src/app/store/ui.selectors';
import { UIState } from 'src/app/store/ui.states';

export class BaseComponent {
  public sideNavVisible$: Observable<boolean>;

  constructor(
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper
  ) {
    this.sideNavVisible$ = of(false);
    if (this.uiStore && this.uiStore.pipe)
      this.sideNavVisible$ = this.uiStore.pipe(select(getSideNavVisible));
    if (viewportScroller) {
      viewportScroller.setOffset([100, 100]);
    }
  }
}
