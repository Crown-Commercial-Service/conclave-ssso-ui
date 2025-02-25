import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { SessionStorageKey } from 'src/app/constants/constant';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-org-support-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class OrgSupportConfirmComponent extends BaseComponent implements OnInit {
  changePassword: boolean = false;
  resetMfa: boolean = false;
  changeRoleType: string = "noChange";
  displayMessage: string = '';
  userName: string = '';
  canContinue: boolean = false;
  public deactivateEnabled: boolean = false;
  public reactivateEnabled : boolean = false; 
  public dormantBy : string ='Manual';
  public fromPage : string ='org_user'

  constructor(private organisationGroupService: WrapperOrganisationGroupService,
    private wrapperUserService: WrapperUserService,
    private mfaService: MFAService,
    private sessionService:SessionService,
    private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
    this.userName = sessionStorage.getItem(SessionStorageKey.OrgUserSupportUserName) ?? '';
    this.route.queryParams.subscribe(para => {
      if (para.rpwd != undefined) {
        this.changePassword = JSON.parse(para.rpwd);
      }

      if (para.rmfa != undefined) {
        this.resetMfa = JSON.parse(para.rmfa);
      }

      if (para.chrole != undefined) {
        this.changeRoleType = para.chrole;
      }
      if (para.deuser != undefined)
      {
        this.deactivateEnabled = JSON.parse(para.deuser);
      }
      if (para.reuser != undefined)
      {
        this.reactivateEnabled = JSON.parse(para.reuser);
      }
    });

    if (this.changeRoleType == "noChange" && !this.changePassword && !this.resetMfa && !this.deactivateEnabled && !this.reactivateEnabled) {
      this.displayMessage = "You haven't selected any changes for the user.";
    }
    else {
      this.canContinue = true;
      this.displayMessage = 'Confirm you want to ';

      if (this.changeRoleType !== "noChange") {
        this.displayMessage = this.displayMessage + (this.changeRoleType == "assign" ? ' assign admin role' : ' unassign admin role')
      }

      if (this.changePassword) {
        this.displayMessage = this.displayMessage + (this.changeRoleType !== "noChange" ? ', change the password' : ' change the password')
      }

      if (this.resetMfa) {
        this.displayMessage = this.displayMessage + (this.changePassword || this.changeRoleType !== "noChange" ? ', reset additional security' : 'reset additional security');
      }
      if (this.deactivateEnabled) {
        this.displayMessage = this.displayMessage + (this.changePassword || this.changeRoleType !== "noChange" || this.resetMfa ?', deactivate the account': 'deactivate the account');
      }
      if (this.reactivateEnabled) 
      {
        this.displayMessage = this.displayMessage +('reactivate the account');
      }


      this.displayMessage = this.displayMessage + ` for ${this.userName}.`;
    }
  }

  public async onSubmitClick(buttonText:string) {
    try {
      if (this.changePassword) {
        await this.wrapperUserService.resetUserPassword(this.userName, "Org-user-support").toPromise();
      }

      if (this.resetMfa) {
        await this.mfaService.sendResetMFANotificationByAdmin(this.userName).toPromise();
      }

      if (this.changeRoleType !== "noChange") {
        if (this.changeRoleType == "assign") {
          await this.wrapperUserService.addAdminRole(this.userName).toPromise();
        }
        else {
          await this.wrapperUserService.removeAdminRoles(this.userName).toPromise();
        }
      }
      if (this.deactivateEnabled)
      {
        await this.wrapperUserService.deActivateUser(this.userName,this.dormantBy,this.fromPage).toPromise();
      }
      if (this.reactivateEnabled)
      {
        await this.wrapperUserService.reActivateUser(this.userName,this.fromPage).toPromise();
      }
      this.router.navigateByUrl(`org-support/success?rpwd=` + this.changePassword + `&rmfa=` + this.resetMfa +
        `&chrole=` + this.changeRoleType + `&deuser=` + this.deactivateEnabled
        + `&reuser=` + this.reactivateEnabled);
    }
    catch (err: any) {
      this.router.navigateByUrl(`org-support/error?errCode=${err.error}`);
    }
    this.pushDataLayerEvent(buttonText); 
  }

  public onCancelClick(buttonText:string) {
    this.router.navigateByUrl(`org-support/details?rpwd=` + this.changePassword + `&rmfa=` + this.resetMfa +
      `&chrole=` + this.changeRoleType +`&deuser=` + this.deactivateEnabled
      + `&reuser=` + this.reactivateEnabled);
      this.pushDataLayerEvent(buttonText);
  }

  pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent('buttonText')
	  }
  
}
