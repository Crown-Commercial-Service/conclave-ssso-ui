import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { UserProfileResponseInfo } from 'src/app/models/user';
import { Group, GroupList } from 'src/app/models/organisationGroup';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgSupportConfirmComponent extends BaseComponent implements OnInit {

  public user$!: Observable<any>;
  private user: UserProfileResponseInfo;
  public orgGroups!: Group[];
  public roles$!: Observable<any>;
  public roles!: [];

  constructor(private organisationGroupService: WrapperOrganisationGroupService, private wrapperUserService: WrapperUserService,
    private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore,viewportScroller,scrollHelper);
    this.user = {
      firstName: '',
      lastName: '',
      organisationId: '',
      title: 0,
      userName: '',
      detail: {
        id: 0,
        canChangePassword: false,

      }
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.userName) {
        this.user$ = this.wrapperUserService.getUser(params.userName).pipe(share());
        this.user$.subscribe({
          next: result => {
            this.user = result;
            this.getOrgGroups();
          }
        });
      }
    });
  }

  public onSubmitClick() {
    this.wrapperUserService.resetUserPassword(this.user.userName, "Org-user-support").subscribe({
      next: (response) => {
        this.setOrgRoles();
      },
      error: (err: any) => {
        console.log(err);
        this.router.navigateByUrl(`org-support/error`);
      }
    });
  }

  setOrgRoles() {
    // TODO this logic can be simplified by taking the assign/unassigned status from the previous screen rather than calling the api again 
    this.roles$ = this.organisationGroupService.getOrganisationRoles(this.user.organisationId).pipe(share());
    this.roles$.subscribe({
      next: (roles) => {
        const role = roles.find((x: any) => x.roleName === 'Organisation Administrator');
        if (role) {
          if (this.isAssigned()) { // Remove
            this.wrapperUserService.removeAdminRoles(this.user.userName).subscribe({
              next: (roleRemoveResponse: boolean) => {
                if (roleRemoveResponse) {
                  this.router.navigateByUrl(`org-support/success/${this.user.userName}`);
                }
                else {
                  console.log("TODO: navigate to error page");
                  this.router.navigateByUrl(`org-support/success/${this.user.userName}`);
                }
              },
              error: (err: any) => {
                console.log(err);
                this.router.navigateByUrl(`org-support/error`);
              }
            });
          } else { // Add
            this.wrapperUserService.addAdminRole(this.user.userName).subscribe({
              next: (addAdminRoleResponse: boolean) => {
                if (addAdminRoleResponse) {
                  this.router.navigateByUrl(`org-support/success/${this.user.userName}`);
                }
                else {
                  console.log("TODO: navigate to error page");
                  this.router.navigateByUrl(`org-support/success/${this.user.userName}`);
                }
              },
              error: (err: any) => {
                console.log(err);
                this.router.navigateByUrl(`org-support/error`);
              }
            });
          }

          // if (this.isAssigned()) {
          //   this.user.roleIds.forEach((item: any, index: any) => {
          //     if (item === role['roleId']) this.user.roleIds.splice(index,1);
          //   });
          //   this.user.roleNames.forEach((item: any, index: any) => {
          //     if (item === 'ORG_ADMINISTRATOR') this.user.roleNames.splice(index,1);
          //   });
          // } else {
          //   this.user.roleIds.push(role['roleId']);
          //   this.user.roleNames.push('ORG_ADMINISTRATOR');
          // }
          // this.wrapperUserService.updateUserRoles(localStorage.getItem('user_name')+'', this.user).subscribe({
          //   next: (userEditResponseInfo: UserEditResponseInfo) => {
          //     if (userEditResponseInfo.userId == this.user.userName) {
          //       this.router.navigateByUrl(`org-support/success-changed-role/${this.user.userName}`);
          //     }
          //     else {
          //       console.log("TODO: navigate to error page");
          //       this.router.navigateByUrl(`org-support/success-changed-role/${this.user.userName}`);
          //     }
          //   },
          //   error: (err: any) => {
          //     console.log(err);
          //     console.log("TODO: tell user");
          //   }
          // });
        } else {
          this.router.navigateByUrl(`org-support/success/${this.user.userName}`);
        }
      }
    });
  }

  isAssigned(): boolean {
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

  // Commented out since not used. Double check with Lee and remove if not needed.
  // setOrgGroups() {
  //   let selectedGroupIds: number[] = [];
  //   this.orgGroups.map(group => {
  //     if (group.groupName === 'Organisation Administrator') {
  //       selectedGroupIds.push(group.groupId);
  //     }
  //   });
  //   this.user.detail.groupIds = selectedGroupIds;
  // }
}
