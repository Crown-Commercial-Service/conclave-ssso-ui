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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-organisation-registration-confirm',
  templateUrl: './manage-organisation-registration-confirm.component.html',
  styleUrls: ['./manage-organisation-registration-confirm.component.scss']
})
export class ManageOrgRegConfirmComponent extends BaseComponent implements OnInit {
  public pageAccessMode:any;
  public emailAddress: string = '';
  public resendActivationEmailMode: boolean = false;
  public buyerFlow:any;
  public isCustomMfaEnabled=environment.appSetting.customMfaEnabled;
  constructor(private userService: UserService, private route: ActivatedRoute,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private router: Router,private ActivatedRoute: ActivatedRoute) {
    super(uiStore, viewportScroller, scrollHelper);
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      if(para.data != undefined){
        this.pageAccessMode = JSON.parse(atob(para.data));
      } else {
        this.pageAccessMode = null
      }
    });
    this.buyerFlow = localStorage.getItem('organisation_type') ?? '';

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


  resendActivationLink() { 
    this.router.navigateByUrl('manage-org/register/confirm?rs');
  }

  public goConfirmOrgPage():void{
    const schemeDetails = JSON.parse(localStorage.getItem('schemeDetails') || '');
    this.router.navigateByUrl(
      `manage-org/register/search/${schemeDetails.scheme}?id=${encodeURIComponent(
        schemeDetails.schemeID
      )}`
    );
  }

  public goToRegSchema():void{
    const schemeDetails = JSON.parse(localStorage.getItem('cii_scheme') || '');
    this.router.navigateByUrl(
      'manage-org/register/search/' +
        schemeDetails.scheme +
        '/' +
        schemeDetails.id +
        '/additional-identifiers'
    );
  }
}
