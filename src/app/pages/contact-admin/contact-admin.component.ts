import { Component, OnInit } from '@angular/core';
import { AdminUserListResponse, UserListResponse } from 'src/app/models/user';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-admin',
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./contact-admin.component.scss'],
})
export class ContactAdminComponent implements OnInit {
  private organisationId: string = '';
  usersTableHeaders = ['Name', 'Email address', 'Role'];
  usersColumnsToDisplay = ['name', 'email', 'role'];
  currentPage: number = 1;
  pageCount: number = 0;
  pageSize: number = environment.listPageSize;
  userListResponse: AdminUserListResponse;
  pageName = 'Contactadmin';

  constructor(
    private WrapperOrganisationGroupService: WrapperOrganisationGroupService
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.userListResponse = {
      currentPage: this.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: []
    }
  }

  ngOnInit(): void {
    this.getOrganisationUsers();
  }

  public openEmailWindow(data: any): void {
    let AdminEmail = 'mailto:' + data.userName;
    window.location.href = AdminEmail;
  }

  getOrganisationUsers() {
    this.WrapperOrganisationGroupService.getUsersAdmin(
      this.organisationId,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: any) => {
        if (response != null) {
          this.userListResponse = response;
          this.userListResponse.userList.forEach(x => {
            x.role = 'Admin';
            x.email = x.userName; // the common component expect the field as email 
          });

          this.pageCount = this.userListResponse.pageCount;
        }
      },
      error: (error: any) => { },
    });
  }

  setPage(pageNumber: any) {
    this.currentPage = pageNumber;
    this.getOrganisationUsers();
  }
  goBack() {
    window.history.back();
  }
}
