import { Component, OnInit } from '@angular/core';
import { UserListResponse } from 'src/app/models/user';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-admin',
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./contact-admin.component.scss'],
})
export class ContactAdminComponent implements OnInit {
  private organisationId: string = '';
  currentPage: number = 1;
  pageCount: number = 0;
  pageSize: number = environment.listPageSize;
  public adminDetails: any = [];

  constructor(
    private WrapperOrganisationGroupService: WrapperOrganisationGroupService
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit(): void {
    this.getOrganisationUsers();
  }

  public openEmailWindow(email: string): void {
    let AdminEmail = 'mailto:' + email;
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
          console.log("userListResponse",userListResponse)
          this.adminDetails=userListResponse.adminUserList
        }
      },
      error: (error: any) => {},
    });
  }
}
