import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CiiAdditionalIdentifier,
  CiiOrgIdentifiersDto,
} from 'src/app/models/org';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { environment } from 'src/environments/environment';
import { ciiService } from 'src/app/services/cii/cii.service';
import { TranslateService } from '@ngx-translate/core';
import { ManualValidationStatus } from 'src/app/constants/enum';

@Component({
  selector: 'app-view-verified-org',
  templateUrl: './view-verified-org.component.html',
  styleUrls: ['./view-verified-org.component.scss'],
})
export class ViewVerifiedOrgComponent implements OnInit {
  private organisationId: string = '';
  pageName = 'Contactadmin';
  public routeDetails: any;
  public registries: CiiOrgIdentifiersDto;
  public additionalIdentifiers?: CiiAdditionalIdentifier[];
  public schemeData: any[] = [];
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
  public isDeletedOrg:boolean = false
  constructor(
    private route: ActivatedRoute,
    private wrapperBuyerAndBothService: WrapperBuyerBothService,
    private WrapperOrganisationGroupService: WrapperOrganisationGroupService,
    private router: Router,
    private ciiService: ciiService,
    private translate: TranslateService
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
      this.schemeData = (await this.ciiService
        .getSchemes()
        .toPromise()) as any[];
      await this.ciiService
        .getOrgDetails(this.routeDetails.event.organisationId, true)
        .toPromise()
        .then((data: any) => {
          this.getOrganisationUsers();
          this.registries = data;
          if (this.registries != undefined) {
            this.additionalIdentifiers = this.registries?.additionalIdentifiers;
          }
        })
        .catch((err) => {
          this.additionalIdentifiers = undefined
          this.isDeletedOrg = true;
          this.getOrganisationUsers();
          console.log('err', err);
        });
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
      this.organisationAdministrator.pageSize,
      true
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
       this.getEventLogDetails();
      },
      error: (error: any) => {
        this.getEventLogDetails();
        if(error.status === 404){
          this.organisationAdministrator.userListResponse.userList = []
          this.isDeletedOrg = true;
        }
        console.log("error",error)
      },
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
          this.eventLog.organisationAuditEventListResponse = response;
          this.eventLog.organisationAuditEventListResponse.organisationAuditEventList.forEach(
            (f: any) => {
              f.owner = (f.firstName ?? '') + ' ' + (f.lastName ?? '') +' ' + (f.actionedBy ?? '');
              if(f.owner.trim() == ''){
                f.defaultOwnerChanges = true
                if(f.event?.toUpperCase() == "INACTIVEORGANISATIONREMOVED"){
                  f.owner = "Automatic organisation removal";
                }
                else if(f.actioned?.toUpperCase() == "AUTOVALIDATION"){
                  f.owner = "Autovalidation";
                }
                else if(f.actioned?.toUpperCase() == "JOB"){
                  f.owner = "Job";
                }
              } else {
                 f.defaultOwnerChanges = false;
                }
              
              if(f.event?.toUpperCase() == "ORGROLEASSIGNED" || f.event?.toUpperCase() == "ORGROLEUNASSIGNED" ||
                 f.event?.toUpperCase() == "ADMINROLEASSIGNED" || f.event?.toUpperCase() == "ADMINROLEUNASSIGNED")
              {
                this.translate.get(f.event).subscribe(val => f.event = val);
                if(f.event.includes('[RoleName]'))
                {
                  var role = f.role;
                  f.event = f.event.replace('[RoleName]', role);
                }
              }
              else{
                this.translate.get(f.event).subscribe(val => f.event = val);
              }
            });
          this.eventLog.pageCount =
            this.eventLog.organisationAuditEventListResponse.pageCount;
        }
      },
      error: (error: any) => {},
    });
  }

  public removeRightToBuy(): void {
    let data = {
      id: this.routeDetails.event.organisationId,
      status :ManualValidationStatus.decline,
      orgName : this.routeDetails.event.organisationName
    };
    this.router.navigateByUrl(
      'remove-right-to-buy?data=' + btoa(JSON.stringify(data))
    );
  }

  goBack() {
    sessionStorage.setItem('activetab', 'verifiedOrg');
    window.history.back();
  }

  public getSchemaName(schema: string): string {
    let selecedScheme = this.schemeData.find((s) => s.scheme === schema);
    if (selecedScheme?.schemeName) {
      return selecedScheme?.schemeName;
    } else if (schema === 'GB-CCS') {
      return 'Internal Identifier';
    } else {
      return '';
    }
  }

  public nevigateViewEdit() {
    let data = {
      companyHouseId: this.registries.identifier?.id,
      Id: this.routeDetails.event.organisationId,
    };
    window.open(
      environment.uri.web.dashboard +
        '/update-org-type/confirm?data=' +
        btoa(JSON.stringify(data)),
      '_blank'
    );
  }
}
