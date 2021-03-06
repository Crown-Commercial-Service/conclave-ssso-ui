import { Component, OnInit } from '@angular/core';
import { UserListResponse } from 'src/app/models/user';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-admin',
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./contact-admin.component.scss'],
})
export class ContactAdminComponent implements OnInit {
  private organisationId: string = '';
  usersTableHeaders = ['Name','', 'Email address','Role'];
  usersColumnsToDisplay = ['firstName', 'lastName','email','role'];
  currentPage: number = 1;
  pageCount: number = 0;
  pageSize: number = environment.listPageSize;
  userList: UserListResponse;
  pageName='Contactadmin';

  constructor(
    private WrapperOrganisationGroupService: WrapperOrganisationGroupService
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.userList = {
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
    let AdminEmail = 'mailto:' + data.email;
    window.location.href = AdminEmail;
  }

  getOrganisationUsers() {
    this.WrapperOrganisationGroupService.getUsersAdmin(
      this.organisationId,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (userListResponse: any) => {
        if (userListResponse != null) {
          this.userList = userListResponse;
          this.userList.userList = userListResponse.adminUserList;
          this.pageCount = this.userList.pageCount;
        }
      },
      error: (error: any) => {},
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
