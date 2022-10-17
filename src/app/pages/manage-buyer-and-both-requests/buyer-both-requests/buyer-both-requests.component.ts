import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserListResponse } from 'src/app/models/user';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buyer-both-requests',
  templateUrl: './buyer-both-requests.component.html',
  styleUrls: ['./buyer-both-requests.component.scss'],
})
export class BuyerBothRequestsComponent implements OnInit {
  public searchText: string = '';
  public searchSumbited: boolean = false;
  public tabConfig = {
    currentusers: true,
    expiredusers: false,
  };
  private organisationId: string = '';
  public pendingVerificationBuyerAndBoth: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['NAME', 'EMAIL', 'Remaining days', 'Organisation'],
    usersColumnsToDisplay: [
      'name',
      'userName',
      'remainingDays',
      'originOrganisation',
    ],
    userList: '',
    pageName: 'Contactadmin',
    hyperTextrray: ['Decline', 'Accept', 'View'],
  };

  public verifiedBuyerAndBoth: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['NAME', 'EMAIL', 'Expiry date', 'Organisation'],
    usersColumnsToDisplay: [
      'name',
      'userName',
      'endDate',
      'originOrganisation',
    ],
    userList: '',
    pageName: 'Contactadmin',
    hyperTextrray: ['View'],
  };
  constructor(
    private router: Router,
    private WrapperUserDelegatedService: WrapperUserDelegatedService
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.pendingVerificationBuyerAndBoth.userList = {
      currentPage: this.pendingVerificationBuyerAndBoth.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
    this.verifiedBuyerAndBoth.userList = {
      currentPage: this.pendingVerificationBuyerAndBoth.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
  }

  ngOnInit() {
    this.tabChanged(sessionStorage.getItem('activetab') || 'currentusers');
    setTimeout(() => {
      this.getOrganisationExpiredUsers();
    }, 10);
    this.getOrganisationCurrentUsers();
  }

  public onSearchClick(): void {
    this.searchSumbited = true;
    setTimeout(() => {
      this.getOrganisationExpiredUsers();
    }, 10);
    this.getOrganisationCurrentUsers();
  }

  public onLinkClick(data: any): void {
    if (data.event.target.innerText === 'Decline') {
      this.router.navigateByUrl(
        'confirm-decline?data=' + btoa(JSON.stringify(data))
      );
    } else if (data.event.target.innerText === 'Accept') {
      this.router.navigateByUrl(
        'confirm-accept?data=' + btoa(JSON.stringify(data))
      );
    } else {
      this.router.navigateByUrl(
        'pending-verification?data=' + btoa(JSON.stringify(data))
      );
    }
  }

  public OnClickView(event: any) {
    let data = {
      header: 'View expired delegated access',
      Description: '',
      Breadcrumb: 'View expired delegated access',
      status: '003',
      event: event,
    };
    this.router.navigateByUrl(
      'verified-organisations?data=' + btoa(JSON.stringify(data))
    );
  }

  setPagecurrentUsers(pageNumber: any) {
    this.pendingVerificationBuyerAndBoth.currentPage = pageNumber;
    this.getOrganisationCurrentUsers();
  }

  setPageexpiredUsers(pageNumber: any) {
    this.verifiedBuyerAndBoth.currentPage = pageNumber;
    this.getOrganisationExpiredUsers();
  }

  getOrganisationCurrentUsers() {
    this.WrapperUserDelegatedService.GetCurrentUsers(
      this.organisationId,
      this.searchText,
      this.pendingVerificationBuyerAndBoth.currentPage,
      this.pendingVerificationBuyerAndBoth.pageSize
    ).subscribe({
      next: (userListResponse: UserListResponse) => {
        if (userListResponse != null) {
          this.pendingVerificationBuyerAndBoth.userList = userListResponse;
          this.pendingVerificationBuyerAndBoth.pageCount =
            this.pendingVerificationBuyerAndBoth.userList.pageCount;
        }
      },
      error: (error: any) => {
        this.router.navigateByUrl('delegated-error');
      },
    });
  }

  getOrganisationExpiredUsers() {
    this.WrapperUserDelegatedService.GetExpiredUsers(
      this.organisationId,
      this.searchText,
      this.verifiedBuyerAndBoth.currentPage,
      this.verifiedBuyerAndBoth.pageSize
    ).subscribe({
      next: (userListResponse: UserListResponse) => {
        if (userListResponse != null) {
          this.verifiedBuyerAndBoth.userList = userListResponse;
          this.verifiedBuyerAndBoth.pageCount =
            this.verifiedBuyerAndBoth.userList.pageCount;
        }
      },
      error: (error: any) => {
        this.router.navigateByUrl('delegated-error');
      },
    });
  }

  public tabChanged(activetab: string): void {
    if (activetab === 'currentusers') {
      this.tabConfig.currentusers = true;
      this.tabConfig.expiredusers = false;
    } else {
      this.tabConfig.expiredusers = true;
      this.tabConfig.currentusers = false;
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('activetab');
  }
}
