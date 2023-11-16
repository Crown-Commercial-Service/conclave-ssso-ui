import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { SessionStorageKey } from 'src/app/constants/constant';
import { DataLayerService } from 'src/app/shared/data-layer.service';


@Component({
  selector: 'mfa-reset-notification-success',
  templateUrl: './send-mfa-reset-notification-success.html',
  styleUrls: ['./send-mfa-reset-notification-success.scss']
})
export class SendMFAResetNotificationSuccessComponent extends BaseComponent implements OnInit {
  userName: string = '';

  constructor(private route: ActivatedRoute, protected uiStore: Store<UIState>,
    public authService: AuthService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private router: Router, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  onNavigateLinkClick() {
    this.authService.logOutAndRedirect();
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
    this.userName = sessionStorage.getItem(SessionStorageKey.MFAResetUserName) ?? '';
  }

  ngOnDestroy() {
    sessionStorage.removeItem(SessionStorageKey.MFAResetUserName);
  }
}
