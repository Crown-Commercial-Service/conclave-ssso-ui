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
import { OrganisationAuditListResponse } from 'src/app/models/organisation';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { HelperService } from 'src/app/shared/helper.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-view-pending-verification',
  templateUrl: './view-pending-verification.component.html',
  styleUrls: ['./view-pending-verification.component.scss'],
})
export class ViewPendingVerificationComponent implements OnInit {
  private organisationId: string = '';
  public lastRoute:string=''
  pageName = 'Contactadmin';
  public routeDetails: any = {};
  public registries: CiiOrgIdentifiersDto;
  public additionalIdentifiers?: CiiAdditionalIdentifier[];
  schemeData: any[] = [];
  public showRoleView:boolean = environment.appSetting.hideSimplifyRole
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
    private SharedDataService:SharedDataService,
    private WrapperOrganisationGroupService: WrapperOrganisationGroupService,
    private router: Router,
    private ciiService: ciiService,
    private translate: TranslateService,
    public helperService:HelperService,
    private dataLayerService: DataLayerService
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
  public registriesTableDetails = {
    headerText : ["Registry","ID",""],
    data : [{
      name:'',
      id:'',
      legalName:'',
      type:''
    } ]
  }
  async ngOnInit() {
    this.route.queryParams.subscribe(async (para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
      this.lastRoute = this.routeDetails.lastRoute
      await this.getPendingVerificationOrg()
    });
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
  }

  public openEmailWindow(data: any): void {
    let AdminEmail = 'mailto:' + data.userName;
    window.location.href = AdminEmail;
  }

  public setRegistriesTableDetails(){
    this.registriesTableDetails.data.forEach((f)=>{
      f.name = this.getSchemaName(this.registries.identifier?.scheme)
      f.id = this.registries.identifier?.id
      f.type = 'Primary'
      f.legalName =''
    })
    this.additionalIdentifiers?.forEach(((f)=>{
      let data = {
        name : this.getSchemaName(f.scheme),
        id : this.getId(f.id, f.scheme),
        type : '',
        legalName:''
      }
      this.registriesTableDetails.data.push(data)
    }))
  }
  
  public getOrganisationUsers() {
    this.WrapperOrganisationGroupService.getUsersAdmin(
      this.routeDetails.organisationId,
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

  public getEventLogDetails(): void {
    this.wrapperBuyerAndBothService
      .getOrgEventLogs(
        this.routeDetails.organisationId,
        this.eventLog.currentPage,
        this.eventLog.pageSize
      )
      .subscribe({
        next: (response: any) => {
          console.log("response",response)
          if (response != null) {
            this.eventLog.organisationAuditEventListResponse = response;
            this.eventLog.organisationAuditEventListResponse.organisationAuditEventList.forEach(
              (f: any) => {
                f.owner =
                  (f.firstName ?? '') +
                  ' ' +
                  (f.lastName ?? '') +
                  ' ' +
                  (f.actionedBy ?? '');
                if (f.owner.trim() == '') {
                  f.defaultOwnerChanges = true;
                  if (f.event?.toUpperCase() == 'INACTIVEORGANISATIONREMOVED') {
                    f.owner = 'Automatic organisation removal';
                  } else if (f.actioned?.toUpperCase() == 'AUTOVALIDATION') {
                    f.owner = 'Autovalidation';
                  } else if (f.actioned?.toUpperCase() == 'JOB') {
                    f.owner = 'Job';
                  }
                } else {
                  f.defaultOwnerChanges = false;
                }

                if (
                  f.event?.toUpperCase() == 'ORGROLEASSIGNED' ||
                  f.event?.toUpperCase() == 'ORGROLEUNASSIGNED' ||
                  f.event?.toUpperCase() == 'ADMINROLEASSIGNED' ||
                  f.event?.toUpperCase() == 'ADMINROLEUNASSIGNED'
                ) 
                {
                  this.translate.get(f.event).subscribe((val) => (f.event = val));
                  
                  if(this.showRoleView){
                    if (f.event.includes('[RoleName]'))  {
                      let roleKey:any=['JAEGGER_SUPPLIER','ACCESS_JAGGAER','CAT_USER','ACCESS_CAAAC_CLIENT','JAEGGER_BUYER','JAGGAER_USER']
                      let filterRole = roleKey.find((element: any) => element == f.roleKey);
                        if(filterRole === undefined)
                        {
                          f.event = f.event.replace('[RoleName]', f.role + ' - ' + f.serviceName);
                        }
                        else
                        {
                          f.event = f.event.replace('[RoleName]', f.role);
                        }
                    }
                  } else {
                    f.event = f.event.replace('[RoleName] role', f.name);
                  }
                } 
                else {
                  this.translate.get(f.event).subscribe((val) => (f.event = val));
                }
              }
            );
            this.eventLog.pageCount =
              this.eventLog.organisationAuditEventListResponse.pageCount;
          }
        },
        error: (error: any) => {},
      });
  }

  private pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Manage Buyer status requests - View request"
    });
  }

  goBack() {
    if (this.lastRoute == "view-verified") {
      this.router.navigateByUrl('manage-buyer-both');
    } else {
      window.history.back();
    }
     this.pushDataLayerEvent();
  }

  public acceptRightToBuy() {
    let data = {
      organisationId: this.routeDetails.organisationId,
      organisationName: this.routeDetails.organisationName,
    };
    this.router.navigateByUrl(
      'confirm-accept?data=' + btoa(JSON.stringify(data))
    );
    this.pushDataLayerEvent();
  }
  public declineRightToBuy() {
    let data = {
      organisationId: this.routeDetails.organisationId,
      organisationName: this.routeDetails.organisationName,
    };
    this.router.navigateByUrl(
      'confirm-decline?data=' + btoa(JSON.stringify(data))
    );
    this.pushDataLayerEvent();
  }

  public getSchemaName(schema: string): string {
    let selecedScheme = this.schemeData.find(s => s.scheme === schema);    
    if (schema === 'GB-CCS') {
      return 'Internal Identifier';
    }
    else if(selecedScheme?.schemeName) {
      return selecedScheme?.schemeName;
    }
    else {
      return '';
    }
  }

  public getId(id:string, schema: string): string {
    return this.SharedDataService.getId(id,schema)
   }

  public convertIdToHyphenId(id:string): string {    
    return this.SharedDataService.convertIdToHyphenId(id)
  }

  getPendingVerificationOrg() {
    this.wrapperBuyerAndBothService.getpendingVerificationOrg(
      this.organisationId,
      this.routeDetails.organisationName,
      1,
      10
    ).subscribe({
      next: async (orgListResponse: OrganisationAuditListResponse) => {
        if (orgListResponse != null && orgListResponse.organisationAuditList.length != 0) {
          this.checkPendingOrganisation(orgListResponse)
          } else {
            this.getVerifiedOrg()
        }
      },
      error: (error: any) => {
        this.router.navigateByUrl('delegated-error');
      },
    });
  }

  private checkPendingOrganisation(orgListResponse: OrganisationAuditListResponse){
    let orgDetails = orgListResponse.organisationAuditList.find((element)=> element.organisationId === this.routeDetails.organisationId )
    if(orgDetails === undefined){
      this.getVerifiedOrg()
    } else {
      this.routeDetails = orgDetails
      this.getSchemesDetails()
    }
  }

  getVerifiedOrg() {
    this.wrapperBuyerAndBothService.getVerifiedOrg(
      this.organisationId,
      this.routeDetails.organisationName,
      1,
      10
    ).subscribe({
      next: (orgListResponse: OrganisationAuditListResponse) => {
        if (orgListResponse != null) {
        let orgDetails = orgListResponse.organisationAuditList.find((element)=> element.organisationId == this.routeDetails.organisationId )
        let data = {
          header: 'View request',
          Description: '',
          Breadcrumb: 'View request',
          status: '003',
          event: orgDetails,
          lastRoute:"pending-verification"
        };
        this.router.navigateByUrl(
          'verified-organisations?data=' + btoa(JSON.stringify(data))
        );
        }
      },
      error: (error: any) => {
        this.router.navigateByUrl('delegated-error');
      },
    });
  }

  private async getSchemesDetails(){
    this.schemeData = (await this.ciiService
      .getSchemes()
      .toPromise()) as any[];
      this.getOrgDetails()
  }

  private async getOrgDetails(){
    await this.ciiService
    .getOrgDetails(this.routeDetails.organisationId, true)
    .toPromise()
    .then((data: any) => {
      this.getOrganisationUsers();
      this.registries = data;
      if (this.registries != undefined) {
        this.additionalIdentifiers = this.registries?.additionalIdentifiers;
      }
      this.setRegistriesTableDetails()
    })
    .catch((err) => {
      this.additionalIdentifiers = undefined
      this.isDeletedOrg = true;
      this.getOrganisationUsers();
      console.log('err', err);
    });
  }
}
