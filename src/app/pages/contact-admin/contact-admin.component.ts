import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AdminUserListResponse, UserListResponse } from 'src/app/models/user';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-contact-admin',
    templateUrl: './contact-admin.component.html',
    styleUrls: ['./contact-admin.component.scss'],
    standalone: false
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
  isOrgAdmin: boolean = false;
  
  constructor(
    private WrapperOrganisationGroupService: WrapperOrganisationGroupService,
    private router: Router,
    private dataLayerService: DataLayerService,
    private sessionService:SessionService,
    public route: ActivatedRoute
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
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.getOrganisationUsers();
    this.dataLayerService.pushPageViewEvent();
    this.route.queryParams.subscribe(params => {
      if (params['isNewTab'] === 'true') {
        const urlTree = this.router.parseUrl(this.router.url);
        delete urlTree.queryParams['isNewTab'];
        this.router.navigateByUrl(urlTree.toString(), { replaceUrl: true });
      }
    });
  }

  public openEmailWindow(data: any): void {
    this.navigateToMailto(data.userName);
  }

  public navigateToMailto(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  getOrganisationUsers() {
    this.WrapperOrganisationGroupService.getUsersAdmin(
      this.organisationId,
      this.currentPage,
      this.pageSize,
      false,
      true
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
  goBack(buttonText:string) {
    this.router.navigateByUrl('profile');
   this.dataLayerService.pushClickEvent(buttonText);
  }
}
