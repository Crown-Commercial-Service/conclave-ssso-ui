import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserListResponse } from 'src/app/models/user';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
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
    pendingOrg: true,
    verifiedOrg: false,
  };
  private organisationId: string = '';
  public pendingVerificationBuyerAndBoth: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['Organisation name ', 'Organisation type ', 'Date of registration'],
    usersColumnsToDisplay: [
      'organisatioName',
      'organisationType',
      'dateofRegistration',
    ],
    userList: '',
    pageName: 'Contactadmin',
    hyperTextrray: ['Decline', 'Accept', 'View'],
  };

  public verifiedBuyerAndBoth: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['Organisation name ', 'Organisation type ', 'Date of registration'],
    usersColumnsToDisplay: [
      'organisatioName',
      'organisationType',
      'dateofRegistration',
    ],
    userList: '',
    pageName: 'Contactadmin',
    hyperTextrray: ['View'],
  };
  constructor(
    private router: Router,
    private wrapperBuyerAndBothService:WrapperBuyerBothService,
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
    this.tabChanged(sessionStorage.getItem('activetab') || 'pendingOrg');
    this.getPendingVerificationOrg();
  }

  public onSearchClick(): void {
    this.searchSumbited = true;
    this.getPendingVerificationOrg();
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
    this.getPendingVerificationOrg();
  }

  setPageexpiredUsers(pageNumber: any) {
    this.verifiedBuyerAndBoth.currentPage = pageNumber;
    this.geVerifiedOrg();
  }

  getPendingVerificationOrg() {
    this.wrapperBuyerAndBothService.getpendingVerificationOrg(
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
        this.geVerifiedOrg()
      },
      error: (error: any) => {
        // this.router.navigateByUrl('delegated-error');
      },
    });
  }

  geVerifiedOrg() {
    this.wrapperBuyerAndBothService.getVerifiedOrg(
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
    if (activetab === 'verifiedOrg') {
      this.tabConfig.pendingOrg = false;
      this.tabConfig.verifiedOrg = true;
    } else {
      this.tabConfig.pendingOrg = true;
      this.tabConfig.verifiedOrg = false;
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('activetab');
  }
}
