import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { timeout } from 'rxjs/operators';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { Data } from 'src/app/models/data';
import { dataService } from 'src/app/services/data/data.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UserService } from 'src/app/services/postgres/user.service';
import { UIState } from 'src/app/store/ui.states';

@Component({
  selector: 'app-manage-organisation-registration-confirm',
  templateUrl: './manage-organisation-registration-confirm.component.html',
  styleUrls: ['./manage-organisation-registration-confirm.component.scss']
})
export class ManageOrgRegConfirmComponent extends BaseComponent implements OnInit, OnDestroy {

  public emailAddress: string = '';
  public resendActivationEmailMode: boolean = false;
  constructor(private userService: UserService, private route: ActivatedRoute,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private router: Router) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
    this.emailAddress = localStorage.getItem('brickendon_org_reg_email_address') + '';
    this.route.queryParams.subscribe(params => {
      if (params['rs'] != undefined) {
        this.resendActivationEmailMode = true;
        this.userService.resendUserActivationEmail(this.emailAddress).toPromise().then(() => {
        });
      }
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('schemeDetails')
  }


  resendActivationLink() {
    this.router.navigateByUrl('manage-org/register/confirm?rs');
  }
}
