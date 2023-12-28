import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/organisationGroup';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { environment } from 'src/environments/environment';
import { ManageDelegateService } from '../service/manage-delegate.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-delegated-user-status',
  templateUrl: './delegated-user-status.component.html',
  styleUrls: ['./delegated-user-status.component.scss'],
})
export class DelegatedUserStatusComponent implements OnInit {
  public formGroup: FormGroup | any;
  private organisationId: string;
  public roleDataList: any[] = [];
  public assignedRoleDataList: any[] = [];
  public UserStatus: any = {
    header: '',
    Description: '',
    Breadcrumb: '',
    status: '',
  };
  public eventLog: any = {
    usersTableHeaders: ['Owner', 'Event', 'Date'],
    usersColumnsToDisplay: ['owner', 'event', 'date'],
    currentPage: 1,
    pageCount: 0,
    pageName: 'eventLog',
    pageSize: environment.listPageSize,
    delegationAuditEventDetails: {
      currentPage: 0,
      pageCount: 0,
      rowCount: 0,
      organisationId: '',
      delegationAuditEventServiceRoleGroupList: [],
    },
  };
  hideSimplifyRole: boolean = environment.appSetting.hideSimplifyRole;
  public formId : string = 'delegated_user_status';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orgRoleService: WrapperOrganisationGroupService,
    private formbuilder: FormBuilder,
    private DelegatedService: ManageDelegateService,
    private DelegationApiService: WrapperUserDelegatedService,
    private titleService: Title,
    private dataLayerService: DataLayerService,
    private sessionService:SessionService,
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.eventLog.delegationAuditEventDetails = {
      currentPage: this.eventLog.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      delegationAuditEventServiceRoleGroupList: [],
    };
  }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
    this.route.queryParams.subscribe((para: any) => {
      let RouteData: any = JSON.parse(atob(para.data));
      if (RouteData.event) {
        console.log('RouteData.event', RouteData.event);
        RouteData.event.userName = decodeURIComponent(
          unescape(RouteData.event.userName)
        );
      }
      switch (RouteData.status) {
        case '001': {
          this.UserStatus = RouteData;
          this.titleService.setTitle(
            `${'User from your Organisation'}   - CCS`
          );
          break;
        }
        case '002': {
          this.UserStatus = RouteData;
          this.titleService.setTitle(`${'User not found'}  - CCS`);
          break;
        }
        case '003': {
          this.UserStatus = RouteData;
          this.UserStatus.Description =
            'View details of expired delegated access for the user. If you want to reinstate delegated access to this user, please use “Delegate to an external user” button on the previous page.';
          this.formGroup = this.formbuilder.group({
            startday: [{ value: '', disabled: true }, [Validators.required]],
            startmonth: [{ value: '', disabled: true }, [Validators.required]],
            startyear: [{ value: '', disabled: true }, [Validators.required]],
            endday: [{ value: '', disabled: true }, [Validators.required]],
            endmonth: [{ value: '', disabled: true }, [Validators.required]],
            endyear: [{ value: '', disabled: true }, [Validators.required]],
          });
          this.titleService.setTitle(
            `${'View expired delegated access'}  - CCS`
          );
          this.getUserDetails(RouteData);
          //statements;
          break;
        }
        case '004': {
          this.UserStatus = RouteData;
          this.titleService.setTitle(`${'Inactive User'}  - CCS`);
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    });
  }

  public getUserDetails(response: any) {
    const startDate = response.event.startDate.split('-');
    const endDate = response.event.endDate.split('-');
    this.formGroup.patchValue({
      startday: startDate[2].slice(0, 2),
      startmonth: startDate[1],
      startyear: startDate[0],
      endday: endDate[2].slice(0, 2),
      endmonth: endDate[1],
      endyear: endDate[0],
    });
    this.getOrgRoles(response);
    this.getEventLogDetails();
  }
  public getOrgRoles(roleResponse: any): void {
    this.orgRoleService
      .getOrganisationRoles(this.organisationId)
      .toPromise()
      .then((response: Role[]) => {
        let orgRoles = response;
        orgRoles.forEach((f) => {
          roleResponse.event.rolePermissionInfo.forEach((element: any) => {
            if (element.roleId === f.roleId) {
              this.roleDataList.push({
                roleId: f.roleId,
                roleKey: f.roleKey,
                accessRoleName: f.roleName,
                serviceName: f.serviceName,
                description: f.description,
              });
              this.formGroup.addControl(
                'orgRoleControl_' + element.roleId,
                this.formbuilder.control(true)
              );
            }
         // this.getEventLogDetails();
          });
        });
      });
  }

  public setPageOrganisationEventLogs(pageNumber: any) {
    this.eventLog.currentPage = pageNumber;
    this.getEventLogDetails();
  }

  pushDataLayerEvent(buttonText:string) {
   this.dataLayerService.pushClickEvent(buttonText)
  }

  public BackToDelegated(buttonText:string): void {
    window.history.back();
    this.pushDataLayerEvent(buttonText);
  }

  public BackToDashboard(buttonText:string): void {
    this.router.navigateByUrl('home');
    this.pushDataLayerEvent(buttonText);
  }
  
  public Back(buttonText:string): void {
    sessionStorage.setItem('activetab', 'expiredusers');
    window.history.back();
    this.pushDataLayerEvent(buttonText);
  }
  public goToDelegatedAccessPage() {
    sessionStorage.setItem('activetab', 'expiredusers');
    this.router.navigateByUrl('delegated-access');
  }

  private getEventLogDetails(): void {
    this.DelegationApiService.getDelegatedEventLogs(
      this.eventLog.pageSize,
      this.eventLog.currentPage,
      this.UserStatus.event.id,
      this.organisationId
    ).subscribe((response) => {
      this.eventLog.delegationAuditEventDetails = response;
      this.eventLog.delegationAuditEventDetails.delegationAuditEventServiceRoleGroupList
      =
      this.DelegatedService.matchDelegatedDetailsOne(
        response.delegationAuditEventServiceRoleGroupList
      );
     this.eventLog.pageCount =  response.pageCount;
    });
  }
}
