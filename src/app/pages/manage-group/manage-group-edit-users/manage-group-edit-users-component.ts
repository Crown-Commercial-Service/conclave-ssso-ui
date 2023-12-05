import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import {
  CheckBoxUserListGridSource,
  UserListInfo,
  UserListResponse,
} from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-manage-group-edit-users',
  templateUrl: './manage-group-edit-users-component.html',
  styleUrls: ['./manage-group-edit-users-component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
})
export class ManageGroupEditUsersComponent
  extends BaseComponent
  implements OnInit
{
  organisationId: string;
  isEdit: boolean = false;
  editingGroupId: number = 0;
  groupName: string = '';
  userNames: string[] = [];
  addingUsers: UserListInfo[] = [];
  removingUsers: UserListInfo[] = [];
  searchSumbited:boolean=false;
  searchingUserName: string = '';
  currentPage: number = 1;
  pageCount: number = 0;
  pageSize: number = environment.listPageSize;
  usersTableHeaders = ['NAME', 'EMAIL', 'SELECT_USER'];
  usersColumnsToDisplay = ['name', 'userName'];
  userGridSource: CheckBoxUserListGridSource[] = [];
  public userName = ''
  public showRoleView:boolean = environment.appSetting.hideSimplifyRole
  groupType: number = 0;
  constructor(
    protected uiStore: Store<UIState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private titleService: Title,
    private wrapperOrganisationService: WrapperOrganisationService,
    private SharedDataService: SharedDataService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.data) {
      let routeData = JSON.parse(queryParams.data);
      this.isEdit = routeData['isEdit'];
      this.editingGroupId = routeData['groupId'];
      this.groupType = routeData['groupType'];
      this.groupName = sessionStorage.getItem('Gname') || '';
      this.userName = localStorage.getItem('user_name') || '';
    }
    var existingUsersString = sessionStorage.getItem('group_existing_users');
    var addingUsersString = sessionStorage.getItem('group_added_users');
    var removingUsersString = sessionStorage.getItem('group_removed_users');
    this.userNames = existingUsersString ? JSON.parse(existingUsersString) : [];
    this.addingUsers = addingUsersString ? JSON.parse(addingUsersString) : [];
    this.removingUsers = removingUsersString
      ? JSON.parse(removingUsersString)
      : [];
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';

    this.SharedDataService.ManageGroup.subscribe((group)=>{
        this.groupName=group;
    })
  }

  ngOnInit() {
    this.titleService.setTitle(
      `${this.isEdit ? 'Add/Remove Users' : 'Add Users'}  - Manage Groups - CCS`
    );
    this.getOrganisationUsers();
  }

  getOrganisationUsers() {
    this.wrapperOrganisationService
      .getUsers(
        this.organisationId,
        this.searchingUserName,
        this.currentPage,
        this.pageSize,
        true
      )
      .subscribe({
        next: (userListResponse: UserListResponse) => {
          if (userListResponse != null) {
            this.userGridSource = [];
            this.pageCount = userListResponse.pageCount;
            userListResponse.userList.map((orgUser: UserListInfo) => {
              let isChecked =
                (this.userNames.findIndex(
                  (uName) => uName == orgUser.userName
                ) != -1 ||
                  this.addingUsers.findIndex(
                    (user) => user.userName == orgUser.userName
                  ) != -1) &&
                this.removingUsers.findIndex(
                  (user) => user.userName == orgUser.userName
                ) == -1;

              let userGridSourceObject: CheckBoxUserListGridSource = {
                name: orgUser.name,
                userName: orgUser.userName,
                isChecked: isChecked,
                isAdmin: orgUser.isAdmin,
                isDisable: this.isAdminGroupAndUser(orgUser.userName)
              };
              this.userGridSource.push(userGridSourceObject);
            });
          }
        },
        error: (error: any) => {},
      });
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  scrollToAnchor(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  searchTextChanged(event: any) {
    this.searchingUserName = event.target.value;
  }

  onSearchClick() {
    this.searchSumbited=true
    this.currentPage = 1;
    this.getOrganisationUsers();
  }

  setPage(pageNumber: any) {
    this.currentPage = pageNumber;
    this.getOrganisationUsers();
  }

  onCheckBoxClickRow(dataRow: CheckBoxUserListGridSource) {
    if (dataRow.isChecked) {
      let inRemovedListIndex = this.removingUsers.findIndex(
        (ru) => ru.userName == dataRow.userName
      );
      if (inRemovedListIndex != -1) {
        // If in removed list removing from there
        this.removingUsers.splice(inRemovedListIndex, 1);
      } else {
        let userInfo: UserListInfo = {
          name: dataRow.name,
          userName: dataRow.userName,
          isAdmin: dataRow.isAdmin
        };
        this.addingUsers.push(userInfo);
      }
    } else {
      let inAddedListIndex = this.addingUsers.findIndex(
        (au) => au.userName == dataRow.userName
      );
      if (inAddedListIndex != -1) {
        // If in added list removing from there
        this.addingUsers.splice(inAddedListIndex, 1);
      } else {
        let userInfo: UserListInfo = {
          name: dataRow.name,
          userName: dataRow.userName,
          isAdmin: dataRow.isAdmin
        };
        this.removingUsers.push(userInfo);
      }
    }
  }

  onContinueClick() {
    sessionStorage.setItem(
      'group_existing_users',
      JSON.stringify(this.userNames)
    );
    sessionStorage.setItem(
      'group_added_users',
      JSON.stringify(this.addingUsers)
    );
    sessionStorage.setItem(
      'group_removed_users',
      JSON.stringify(this.removingUsers)
    );
    this.SharedDataService.manageGroupStorage(this.groupName);
    let data = {
      isEdit: this.isEdit,
      groupId: this.editingGroupId,
    };
    this.router.navigateByUrl(
      'manage-groups/edit-users-confirm?data=' + JSON.stringify(data)
    );
  }

  onCancelClick() {
    let data = {
      isEdit: true,
      groupId: this.editingGroupId,
    };
    sessionStorage.removeItem('group_existing_users');
    sessionStorage.removeItem('group_added_users');
    sessionStorage.removeItem('group_removed_users');
    this.router.navigateByUrl(
      'manage-groups/view?data=' + JSON.stringify(data)
    );
  }

  public isAdminGroupAndUser(totalUserName:string){
    let isAdmin =  totalUserName === this.userName
    if(isAdmin && this.groupType == 1){
      return true
    } else {
      return false
    }
  }
}
