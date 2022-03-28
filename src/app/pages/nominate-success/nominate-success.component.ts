import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { UIState } from 'src/app/store/ui.states';

@Component({
  selector: 'app-nominate-success',
  templateUrl: './nominate-success.component.html',
  styleUrls: ['./nominate-success.component.scss'],
})
export class NominateSuccessComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private subscription: Subscription | undefined;
  public emailAddress: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: SharedDataService,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.dataService.NominiData.subscribe((data) => {
      if (data) {
        sessionStorage.setItem('emailAddress', data);
        this.emailAddress = sessionStorage.getItem('emailAddress');
      } else {
        this.emailAddress = sessionStorage.getItem('email  Address');
      }
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
