import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'mfa-reset-component',
  templateUrl: './mfa-reset-component.html',
  styleUrls: ['./mfa-reset-component.scss']
})
export class MFAResetComponent extends BaseComponent implements OnInit {
  resetSuccess: boolean = false;
  userName: string = '';
  resultVerified: boolean = false;
  titlePrefix: string = '';

  constructor(private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    private mfaService: MFAService, private authService: AuthService, private titleService: Title,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  onNavigateLinkClick() {
    this.authService.logOutAndRedirect();
  }

  onResetMfaClick() {
    this.mfaService.sendResetMFANotification(this.userName).toPromise().then(() => {
      this.router.navigateByUrl('mfaresetnotification?success&u=' + encodeURIComponent(this.userName));
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(para => {
      this.mfaService.resetMFA(para.t).toPromise().then(() => {
        this.resetSuccess = true;
        this.resultVerified = true;
        this.titleService.setTitle(`Success - Additional security Reset - CCS`);
      }).catch((er: any) => {
        this.resetSuccess = false;
        this.resultVerified = true;
        this.titleService.setTitle(`Error - Additional security Reset - CCS`);
        if (er.error.error == 'INVALID_TICKET') {
          this.userName = er.error.error_description;
        }
      });
    });
  }
}
