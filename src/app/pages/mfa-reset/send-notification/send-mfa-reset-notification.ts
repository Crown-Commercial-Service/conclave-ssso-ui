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
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';


@Component({
  selector: 'mfa-reset-notification',
  templateUrl: './send-mfa-reset-notification.html',
  styleUrls: ['./send-mfa-reset-notification.scss']
})
export class SendMFAResetNotificationComponent extends BaseComponent implements OnInit {
  sendError: boolean = false;
  userName: string = '';
  protected mailDecryptKey = environment.mailDecryptKey
  constructor(private route: ActivatedRoute, public router: Router, protected uiStore: Store<UIState>,
    private mfaService: MFAService, private authService: AuthService,private sessionService:SessionService,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
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
          user_name: this.sessionService.decrypt('user_name'),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
    this.route.queryParams.subscribe(para => {
      if (para.u && para.u !== '') {
        var decryptedValue = CryptoJS.AES.decrypt(decodeURIComponent(para.u), this.mailDecryptKey);
        var originalUsername = decryptedValue.toString(CryptoJS.enc.Utf8);
        this.userName = originalUsername;
        sessionStorage.setItem(SessionStorageKey.MFAResetUserName, originalUsername);
      }
      else {
        this.userName = sessionStorage.getItem(SessionStorageKey.MFAResetUserName) ?? '';
      }

      this.mfaService.sendResetMFANotification(this.userName).toPromise().then(() => {
        this.router.navigateByUrl('mfaresetnotification/success');
      }).catch((error: any) => {
        this.sendError = true;
      });
    });
  }
}
