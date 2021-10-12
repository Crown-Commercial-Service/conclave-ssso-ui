import { ViewportScroller } from '@angular/common';
import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';

@Component({
  selector: 'app-nominate-success',
  templateUrl: './nominate-success.component.html',
  styleUrls: ['./nominate-success.component.scss']
})
export class NominateSuccessComponent extends BaseComponent {

  public emailAddress: string = '';

  constructor(private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.route.queryParams.subscribe(para => {
      this.emailAddress = para.uid;
    });
  }
}
