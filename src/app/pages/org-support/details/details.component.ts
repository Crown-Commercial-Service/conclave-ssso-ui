import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { Group, GroupList } from 'src/app/models/organisationGroup';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { UserProfileResponseInfo } from 'src/app/models/user';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SessionStorageKey } from 'src/app/constants/constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-org-support-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgSupportDetailsComponent extends BaseComponent implements OnInit {

  public user$!: Observable<any>;
  public user: UserProfileResponseInfo;
  public assign: boolean = true;
  public changeRoleEnabled: boolean = false;
  public resetPasswordEnabled: boolean = false;
  public resetMfaEnabled: boolean = false;
  public orgGroups!: Group[];
  public roles$!: Observable<any>;
  public roles!: [];
  public customMfaEnabled = environment.appSetting.customMfaEnabled;
  
  @ViewChild('assignChk') assignChk!: ElementRef;
  @ViewChild('resetPassword') resetPassword!: ElementRef;

  constructor(private organisationGroupService: WrapperOrganisationGroupService, private wrapperUserService: WrapperUserService,
    public router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.user = {
      firstName: '',
      lastName: '',
      organisationId: '',
      title: '',
      userName: '',
      mfaEnabled: false,
      mfaOpted:false,
      isAdminUser:false,
      detail: {
        id: 0,
        canChangePassword: false

      },
      isDormant:false
    }
  }

  ngOnInit() {
    let userName = sessionStorage.getItem(SessionStorageKey.OrgUserSupportUserName);
    if (userName) {
      this.user$ = this.wrapperUserService.getUser(userName).pipe(share());
      this.user$.subscribe({
        next: (result: UserProfileResponseInfo) => {
          this.user = result;
          this.getOrgGroups();
        }
      });
    }
    this.route.queryParams.subscribe(para => {
      if (para.rpwd != undefined) {
        this.resetPasswordEnabled = JSON.parse(para.rpwd);
      }

      if (para.rmfa != undefined) {
        this.resetMfaEnabled = JSON.parse(para.rmfa);
      }

      if (para.chrole != undefined) {
        this.changeRoleEnabled = para.chrole != "noChange";
      }
    });
  }

  public onSelect(event: any, assigned: boolean) {
    // this.assign = assigned;
    if (event.target.nodeName === 'LABEL') {
      event.target.previousSibling.checked = !event.target.previousSibling.checked;
      this.changeRoleEnabled = event.target.previousSibling.checked;
    }
  }

  public onResetSelect(event: any) {
    // this.assign = assigned;
    if (event.target.nodeName === 'LABEL') {
      event.target.previousSibling.checked = !event.target.previousSibling.checked;
      this.resetPasswordEnabled = event.target.previousSibling.checked;
    }
  }

  public onMfaResetSelect(event: any) {
    if (event.target.nodeName === 'LABEL') {
      event.target.previousSibling.checked = !event.target.previousSibling.checked;
      this.resetMfaEnabled = event.target.previousSibling.checked;
    }
  }

  public onContinueClick() {
    let hasAdminRole = this.hasAdminRole();
    this.router.navigateByUrl(`org-support/confirm?rpwd=` + this.resetPasswordEnabled + `&rmfa=` + this.resetMfaEnabled +
      `&chrole=${this.changeRoleEnabled ? (hasAdminRole ? "unassign" : "assign") : "noChange"}`);
  }

  public onCancelClick() {
    this.router.navigateByUrl('org-support/search');
  }

  getOrgGroups() {
    this.organisationGroupService.getOrganisationGroups(this.user.organisationId).subscribe({
      next: (orgGroups: GroupList) => {
        this.orgGroups = orgGroups.groupList;
        this.orgGroups.map(group => {
          let isGroupOfUser: boolean = false;
          isGroupOfUser = this.user.detail.userGroups ? this.user.detail.userGroups.some(ug => ug.groupId == group.groupId) : false;
        });
      },
      error: (err: any) => {
        console.log(err)
      }
    });
  }
  isResetSecurityEnable():boolean {
    return this.customMfaEnabled
    ? this.user.mfaOpted && this.user.mfaEnabled
    : this.user.mfaEnabled;
  }
  hasAdminRole(): boolean {
    const adminName = 'ORG_ADMINISTRATOR';
    if (this.user.detail.rolePermissionInfo && this.user.detail.rolePermissionInfo.some(rp => rp.roleKey == adminName)) {
      return true;
    }
    else if (this.user.detail.userGroups && this.user.detail.userGroups.some((i: { accessRole: string; }) => i.accessRole === adminName)) {
      return true;
    }
    else {
      return false;
    }
  }

  isUserPasswordIdentifier(): boolean {
    if (this.user.detail.identityProviders?.some(idp => idp.identityProvider === 'Username-Password-Authentication')) {
      return true;
    }
    return false;
  }
}
