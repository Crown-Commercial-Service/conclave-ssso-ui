import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { slideAnimation } from 'src/app/animations/slide.animation';
import {UserListInfo,UserListResponse} from 'src/app/models/user';
import { Router } from '@angular/router';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { environment } from 'src/environments/environment';
import { AuditLoggerService } from 'src/app/services/postgres/logger.service';
import { SessionStorageKey } from 'src/app/constants/constant';

@Component({
  selector: 'app-manage-user-profiles',
  templateUrl: './manage-user-profiles-component.html',
  styleUrls: ['./manage-user-profiles-component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
})

export class ManageUserProfilesComponent extends BaseComponent implements OnInit {
  public  userList: UserListResponse;
  private organisationId: string;
  public searchingUserName: string = '';
  public currentPage: number = 1;
  public pageCount: number = 0;
  public pageSize: number = environment.listPageSize;
  public usersTableHeaders = ['NAME', 'EMAIL'];
  public usersColumnsToDisplay = ['name', 'userName'];
  public searchSumbited: boolean = false;

  constructor(
    private wrapperOrganisationService: WrapperOrganisationService,
    protected uiStore: Store<UIState>,
    private router: Router,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private auditLogService: AuditLoggerService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.userList = {
      currentPage: this.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
    sessionStorage.removeItem(SessionStorageKey.ManageUserUserName);
    sessionStorage.removeItem(SessionStorageKey.OperationSuccessUserName);
  }

  async ngOnInit() {
    await this.auditLogService
      .createLog({
        eventName: 'Access',
        applicationName: 'Manage-user-account',
        referenceData: `UI-Log`,
      })
      .toPromise();
    this.getOrganisationUsers();
  }

  private getOrganisationUsers(): void {
    this.wrapperOrganisationService.getUsers(this.organisationId,this.searchingUserName,this.currentPage,this.pageSize)
      .subscribe({
        next: (userListResponse: UserListResponse) => {
          if (userListResponse != null) {
            this.userList = userListResponse;
            this.pageCount = this.userList.pageCount;
          }
        },
        error: (error: any) => {},
      });
  }

  public onAddClick(): void {
    this.router.navigateByUrl('manage-users/add-user/details');
  }

  private searchTextChanged(event: any) {
    this.searchingUserName = event.target.value;
  }

  public onSearchClick(): void {
    this.searchSumbited = true;
    this.currentPage = 1;
    this.getOrganisationUsers();
  }

  public setPage(pageNumber: any): void {
    this.currentPage = pageNumber;
    this.getOrganisationUsers();
  }

  public onEditRow(dataRow: UserListInfo): void {
    console.log(dataRow);
    let data = {
      isEdit: true,
      rowData: dataRow.userName,
    };
    sessionStorage.setItem(
      SessionStorageKey.ManageUserUserName,
      dataRow.userName
    );
    this.router.navigateByUrl(
      'manage-users/add-user/details?data=' + btoa(JSON.stringify(data))
    );
  }
}
