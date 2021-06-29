import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';

@Component({
  selector: 'app-org-support-confirm-reset-password',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgSupportConfirmResetPasswordComponent extends BaseComponent implements OnInit {

  userName: string;

  constructor(private userService: WrapperUserService, private router: Router, private route: ActivatedRoute,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.userName = '';
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.userName) {
        this.userName = params.userName;
      }
    });
  }

  public onSubmitClick() {
    this.userService.resetUserPassword(this.userName, "Org-user-support").toPromise().then(() => {
      this.router.navigateByUrl(`org-support/success-reset-password/${this.userName}`);
    }).catch(error => {
      console.log(error);
      this.router.navigateByUrl(`org-support/error`);
    });
  }

  public onCancelClick() {
    this.router.navigateByUrl('org-support/search');
  }
}
