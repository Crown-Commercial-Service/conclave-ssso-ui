import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserListResponse } from 'src/app/models/user';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { environment } from 'src/environments/environment';
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: 'app-delegated-user-list',
  templateUrl: './delegated-user-list.component.html',
  styleUrls: ['./delegated-user-list.component.scss'],
})
export class DelegatedUserListComponent implements OnInit ,OnDestroy {
  public searchText: string = '';
  public searchSumbited: boolean = false;
  public tabConfig = {
    currentusers: true,
    expiredusers: false
  }
  public organisationId: string = '';
  public currentUserstableConfig: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['NAME', 'EMAIL','Start date','End date','Organisation'],
    usersColumnsToDisplay: ['name', 'userName', 'startDate','endDate', 'originOrganisation'],
    userList: '',
    pageName: 'Delegatedaccess',
    hyperTextrray: ['Remove', 'Edit']
  }

  public expiredUserstableConfig: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['NAME', 'EMAIL', 'Expiry date', 'Organisation'],
    usersColumnsToDisplay: ['name', 'userName', 'endDate', 'originOrganisation'],
    userList: '',
    pageName: 'Delegatedaccess',
    hyperTextrray: ['View']
  }

  constructor(public router: Router, private WrapperUserDelegatedService: WrapperUserDelegatedService, 
               private dataLayerService: DataLayerService, private authService: AuthService) {

    this.organisationId = localStorage.getItem('cii_organisation_id') || ''
    this.currentUserstableConfig.userList = {
      currentPage: this.currentUserstableConfig.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
    this.expiredUserstableConfig.userList = {
      currentPage: this.currentUserstableConfig.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
  }


  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
    this.tabChanged(sessionStorage.getItem('activetab') || 'currentusers')
    setTimeout(() => {
      this.getOrganisationExpiredUsers()
    }, 10);
    this.getOrganisationCurrentUsers()
  }

  public onSearchClick(): void {
    this.searchSumbited = true
    setTimeout(() => {
      this.getOrganisationExpiredUsers()
    }, 10);
    this.getOrganisationCurrentUsers()
  }


  public onLinkClick(data: any): void {
    if (data.event.target.innerText === "Remove") {
      data.pageaccessmode = 'remove'
      data.userName = escape(encodeURIComponent(data.userName));
      this.router.navigateByUrl('delegated-remove-confirm?data=' + btoa(JSON.stringify(data)));
    } else {
      data.pageaccessmode = 'edit'
      data.userName = escape(encodeURIComponent(data.userName));
      this.router.navigateByUrl('delegate-access-user?data=' + btoa(JSON.stringify(data)));
    }
  }

  public OnClickView(event: any) {
    let data = {
      header: 'View expired delegated access',
      Description: '',
      Breadcrumb: 'View expired delegated access',
      status: '003',
      event: event
    }
    data.event.userName = escape(encodeURIComponent(data.event.userName));
    this.router.navigateByUrl('delegated-user-status?data=' + btoa(JSON.stringify(data)))
  }

  setPagecurrentUsers(pageNumber: any) {
    this.currentUserstableConfig.currentPage = pageNumber;
    this.getOrganisationCurrentUsers();
  }
  
  setPageexpiredUsers(pageNumber: any) {
    this.expiredUserstableConfig.currentPage = pageNumber;
    this.getOrganisationExpiredUsers();
  }

  public FindDelegateUser(buttonText:string): void {
    this.router.navigateByUrl('find-delegated-user');
    this.dataLayerService.pushClickEvent(buttonText)
  }

  getOrganisationCurrentUsers() {
    this.WrapperUserDelegatedService.GetCurrentUsers(this.organisationId, this.searchText, this.currentUserstableConfig.currentPage, this.currentUserstableConfig.pageSize).subscribe({
      next: (userListResponse: UserListResponse) => {
        if (userListResponse != null) {
          this.currentUserstableConfig.userList = userListResponse;
          this.currentUserstableConfig.pageCount = this.currentUserstableConfig.userList.pageCount
        }
      },
      error: (error: any) => {
        if (error?.status == 401) {
          this.authService.logOutAndRedirect();
        }
        else{
          this.router.navigateByUrl('delegated-error')
        }
      }
    });
  }


  getOrganisationExpiredUsers() {
    this.WrapperUserDelegatedService.GetExpiredUsers(this.organisationId, this.searchText, this.expiredUserstableConfig.currentPage, this.expiredUserstableConfig.pageSize).subscribe({
      next: (userListResponse: UserListResponse) => {
        if (userListResponse != null) {
          this.expiredUserstableConfig.userList = userListResponse;
          this.expiredUserstableConfig.pageCount = this.expiredUserstableConfig.userList.pageCount
        }
      },
      error: (error: any) => {
        if (error?.status == 401) {
          this.authService.logOutAndRedirect();
        }
        else{
        this.router.navigateByUrl('delegated-error')
        }
      }
    });
  }



  public tabChanged(activetab: string): void {
    document.getElementById(activetab)?.scrollIntoView({
      block: 'start',
      inline: 'nearest',
    });
   
    if (activetab === 'currentusers') {
      this.tabConfig.currentusers = true
      this.tabConfig.expiredusers = false
    } else {
      this.tabConfig.expiredusers = true
      this.tabConfig.currentusers = false
    }

    this.dataLayerService.pushEvent({
      event: "tab_navigation",
      link_text: activetab === 'currentusers' ? "Current users with delegated access to your Organisation": "Users with expired delegated access to your Organisation"
    })
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('activetab')
  }
}
