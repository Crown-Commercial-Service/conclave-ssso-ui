import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MFAService } from 'src/app/services/auth/mfa.service';


@Component({
  selector: 'mfa-reset-notification-success',
  templateUrl: './send-mfa-reset-notification-success.html',
  styleUrls: ['./send-mfa-reset-notification-success.scss']
})
export class SendMFAResetNotificationSuccessComponent extends BaseComponent implements OnInit {
  userName: string = '';

  constructor(private route: ActivatedRoute,protected uiStore: Store<UIState>,
    private authService: AuthService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  onNavigateLinkClick() {
    this.authService.logOutAndRedirect();
  }

  ngOnInit() {
    debugger;
    this.route.queryParams.subscribe(para => {
      this.userName = para.u;
    });
  }
}
