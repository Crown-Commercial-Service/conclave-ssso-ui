import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-verified-org',
  templateUrl: './view-verified-org.component.html',
  styleUrls: ['./view-verified-org.component.scss']
})
export class ViewVerifiedOrgComponent implements OnInit {
  private organisationId: string = '';
  pageName = 'Contactadmin';
  public organisationAdministrator = {
    usersTableHeaders: ['Name', 'Email address', 'Role'],
    usersColumnsToDisplay: ['name', 'email', 'role'],
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    userListResponse: {
      currentPage: 0,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    },
  };

  public eventLog = {
    usersTableHeaders: ['Owner', 'Event', 'Date'],
    usersColumnsToDisplay: ['name', 'email', 'role'],
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    userListResponse: {
      currentPage: 0,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    },
  };

  constructor(
    private WrapperOrganisationGroupService: WrapperOrganisationGroupService,
    private router:Router
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.organisationAdministrator.userListResponse = {
      currentPage: this.organisationAdministrator.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
    this.eventLog.userListResponse = {
      currentPage: this.eventLog.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
  }

   ngOnInit() {
   this.getOrganisationUsers();
  }

  public openEmailWindow(data: any): void {
    let AdminEmail = 'mailto:' + data.userName;
    window.location.href = AdminEmail;
  }

  public getOrganisationUsers() {
    this.WrapperOrganisationGroupService.getUsersAdmin(
      this.organisationId,
      this.organisationAdministrator.currentPage,
      this.organisationAdministrator.pageSize
    ).subscribe({
      next: (response: any) => {
        if (response != null) {
          this.organisationAdministrator.userListResponse = response;
          this.organisationAdministrator.userListResponse.userList.forEach(
            (f: any) => {
              f.role = 'Admin';
              f.email = f.userName; // the common component expect the field as email
            }
          );
          this.organisationAdministrator.pageCount =
            this.organisationAdministrator.userListResponse.pageCount;
    this.getEventLogDetails()

        }
      },
      error: (error: any) => {},
    });
  }

  public setPageOrganisationAdministrator(pageNumber: any) {
    this.organisationAdministrator.currentPage = pageNumber;
    this.getOrganisationUsers();
  }

  public getEventLogDetails():void{
    this.WrapperOrganisationGroupService.getUsersAdmin(
      this.organisationId,
      this.eventLog.currentPage,
      this.eventLog.pageSize
    ).subscribe({
      next: (response: any) => {
        if (response != null) {
          this.eventLog.userListResponse = response;
          this.eventLog.userListResponse.userList.forEach(
            (f: any) => {
              f.role = 'Admin';
              f.email = f.userName; // the common component expect the field as email
            }
          );
          this.eventLog.pageCount =
            this.eventLog.userListResponse.pageCount;
        }
      },
      error: (error: any) => {},
    });
  }


  public removeRightToBuy():void{
    let data = {
      id:'123456'
    }
    this.router.navigateByUrl(
      'remove-right-to-buy?data=' + btoa(JSON.stringify(data))
    );
  }
  goBack() {
    window.history.back();
  }
}
