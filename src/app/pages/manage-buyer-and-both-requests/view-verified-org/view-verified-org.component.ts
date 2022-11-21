import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CiiAdditionalIdentifier, CiiOrgIdentifiersDto } from 'src/app/models/org';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { environment } from 'src/environments/environment';
import { ciiService } from 'src/app/services/cii/cii.service';

@Component({
  selector: 'app-view-verified-org',
  templateUrl: './view-verified-org.component.html',
  styleUrls: ['./view-verified-org.component.scss']
})
export class ViewVerifiedOrgComponent implements OnInit {
  private organisationId: string = '';
  pageName = 'Contactadmin';
  public routeDetails:any;
  public registries: CiiOrgIdentifiersDto;
  public additionalIdentifiers?: CiiAdditionalIdentifier[];
  schemeData: any[] = [];
  
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
    usersColumnsToDisplay: ['owner', 'event', 'date'],
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    organisationAuditEventListResponse: {
      currentPage: 0,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      organisationAuditEventList: [],
    },
  };

  constructor(private route: ActivatedRoute, private wrapperBuyerAndBothService:WrapperBuyerBothService,
    private WrapperOrganisationGroupService: WrapperOrganisationGroupService,
    private router:Router, private ciiService: ciiService
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.organisationAdministrator.userListResponse = {
      currentPage: this.organisationAdministrator.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
    this.eventLog.organisationAuditEventListResponse = {
      currentPage: this.eventLog.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      organisationAuditEventList: [],
    };
    this.registries = {};
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async (para: any) => {
     this.routeDetails = JSON.parse(atob(para.data));
     this.schemeData = await this.ciiService.getSchemes().toPromise() as any[];
     this.registries = await this.ciiService.getOrgDetails(this.routeDetails.event.organisationId, true).toPromise();
     if (this.registries != undefined) {
       this.additionalIdentifiers = this.registries?.additionalIdentifiers;
     }
     this.getOrganisationUsers();
     this.getEventLogDetails();
    });
  }

  public openEmailWindow(data: any): void {
    let AdminEmail = 'mailto:' + data.userName;
    window.location.href = AdminEmail;
  }

  public getOrganisationUsers() {
    this.WrapperOrganisationGroupService.getUsersAdmin(
      this.routeDetails.event.organisationId,
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
        }
      },
      error: (error: any) => {},
    });
  }

  public setPageOrganisationAdministrator(pageNumber: any) {
    this.organisationAdministrator.currentPage = pageNumber;
    this.getOrganisationUsers();
  }

  public setPageOrganisationEventLogs(pageNumber: any) {
    this.eventLog.currentPage = pageNumber;
    this.getEventLogDetails();
  }

  public getEventLogDetails():void{
    this.wrapperBuyerAndBothService.getOrgEventLogs(
      this.routeDetails.event.organisationId,
      this.eventLog.currentPage,
      this.eventLog.pageSize
    ).subscribe({
      next: (response: any) => {
        if (response != null) {
          debugger;
          this.eventLog.organisationAuditEventListResponse = response;
          this.eventLog.organisationAuditEventListResponse.organisationAuditEventList.forEach(
            (f: any) => {
              f.owner = (f.firstName ?? '') + ' ' + (f.lastName ?? '') +' ' + (f.actionedBy ?? '')
            }
          );
          this.eventLog.pageCount =
            this.eventLog.organisationAuditEventListResponse.pageCount;
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
    sessionStorage.setItem('activetab','verifiedOrg')
    window.history.back();
  }

  public getSchemaName(schema: string): string {
    let selecedScheme = this.schemeData.find(s => s.scheme === schema);
    if(selecedScheme?.schemeName) {
      return selecedScheme?.schemeName;
    }
    else if (schema === 'GB-CCS') {
      return 'Internal Identifier';
    }
    else {
      return '';
    }
  }
}
