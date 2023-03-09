import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Pipe,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { dataService } from 'src/app/services/data/data.service';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { UIState } from 'src/app/store/ui.states';
import { SystemModule } from 'src/app/models/system';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/services/auth/token.service';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { CcsServiceInfo } from 'src/app/models/configurations';
import { ServicePermission } from 'src/app/models/servicePermission';
import { ciiService } from 'src/app/services/cii/cii.service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { ManageDelegateService } from '../manage-delegated/service/manage-delegate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit {
  switchedOrgId=''
  isDelegation:boolean=!environment.appSetting.hideDelegation
  public orgDetails: any = ''
  systemModules: SystemModule[] = [];
  ccsModules: SystemModule[] = [];
  otherModules: SystemModule[] = [];
  ccsServices: CcsServiceInfo[] = [];
  servicePermissions: ServicePermission[] = [];
  idam_client_id: string = environment.idam_client_id;
  targetURL: string = environment.uri.api.security;
  accesstoken: any;
  opIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(
    environment.uri.api.security +
      '/security/sessions/?origin=' +
      environment.uri.web.dashboard
  );
  rpIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(
    environment.uri.web.dashboard + '/assets/rpIFrame.html'
  );
  ciiOrganisationId = localStorage.getItem('cii_organisation_id') || '';
  isOrgAdmin: boolean = false;
  constructor(
    protected uiStore: Store<UIState>,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private readonly tokenService: TokenService,
    private ciiService: ciiService,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private delegatedApiService: WrapperUserDelegatedService,
    private DelegateService: ManageDelegateService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.switchedOrgId = localStorage.getItem('permission_organisation_id') || "" 
  }

  ngOnInit() {
  this.checkValidOrganisation()
  }
 
  public checkValidOrganisation(){
    this.delegatedApiService.getDeligatedOrg().subscribe({
      next: (data: any) => {
        let orgDetails = data.detail.delegatedOrgs.find((element: { delegatedOrgId: string; })=> element.delegatedOrgId == this.switchedOrgId)
        if(orgDetails === undefined){
          this.DelegateService.setDelegatedOrg(0,'home');
          this.initializer()
        } else {
          this.initializer()
        }
      },
      error: (error: any) => {
        console.log("error",error)
      },
    });
  }


  public initializer(){
    this.authService.getPermissions('HOME').toPromise().then((response) => {
      this.servicePermissions = response;
      this.isOrgAdmin = this.servicePermissions.some(x => x.roleKey === "ORG_ADMINISTRATOR"); 
      localStorage.setItem('isOrgAdmin', JSON.stringify(this.isOrgAdmin));
        this.authService.getCcsServices().toPromise().then((data: any) => {
            this.ccsServices = data;
            response.forEach((e: any, i: any) => {
              this.loadActivities(e);
            });
              this.loadServices();
              this.getDelegatedOrganisation();
              setTimeout(() => {
              this.GetOrgDetails()
              },10 );
          });
      });
  }
 

  getCcsService(code: string) {
    return this.ccsServices.find((c) => c.code == code);
  }

  public hasAccess(role: string): boolean {
    if (this.accesstoken) {
      const roles = JSON.parse(this.accesstoken.roles);
      const match = roles.find((x: string) => x === role);
      if (match) {
        return true;
      }
    }
    return false;
  }

  loadServices() {
    if(environment.appSetting.hideSimplifyRole){
      let permissions = this.servicePermissions.filter((sp) =>
      sp.permissionName.startsWith('ACCESS_')
    );
    this.ccsServices.forEach((service: CcsServiceInfo) => {
      let permisson = permissions.find(
        (p) => p.permissionName == 'ACCESS_' + service.code
      );
      if (permisson) {
        this.ccsModules.push({
          name: service?.name,
          description: service?.description,
          href: service?.url,
        });
      }
    });
    } else {
      let permissions = this.servicePermissions.filter((sp) =>
      sp.permissionName.endsWith('_DS')
    );
    this.ccsServices.forEach((service: CcsServiceInfo) => {
      let permisson = permissions.find(
        (p) => p.permissionName ==  service.code 
      );
      if (permisson) {
        this.ccsModules.push({
          name: service.name,
          description: service.description,
          href: service.url,
        });
      }
    });
    }
  }

  loadActivities(e: any) {
    if (e.permissionName === 'MANAGE_USERS') {
      if (
        this.systemModules.findIndex((x) => x.name === 'Manage users') === -1
      ) {
        this.systemModules.push({
          name: 'Manage users',
          description: 'Create and manage users and what they can do',
          route: '/manage-users',
        });
      }
    }
    if (e.permissionName === 'MANAGE_ORGS') {
      if (
        this.systemModules.findIndex(
          (x) => x.name === 'Manage organisation(s)'
        ) === -1
      ) {
        this.systemModules.push({
          name: 'Manage organisation(s)',
          description: 'View details for your organisation',
          route: '/manage-org/profile',
        });


      }
    }
    if (e.permissionName === 'MANAGE_GROUPS') {
      if (
        this.systemModules.findIndex((x) => x.name === 'Manage groups') === -1
      ) {
        this.systemModules.push({
          name: 'Manage groups',
          description: 'Create groups and organize users',
          route: '/manage-groups',
        });
      }
    }
    if (e.permissionName === 'MANAGE_MY_ACCOUNT') {
      if (
        this.systemModules.findIndex((x) => x.name === 'Manage my account') ===
        -1
      ) {
        this.systemModules.push({
          name: 'Manage my account',
          description: 'Manage your details',
          route: '/profile',
        });
      }
    }

    if (e.permissionName === 'DELEGATED_ACCESS' && this.isDelegation) {
        this.systemModules.push({
          name: 'Delegated access',
          description: 'Manage delegated access to your approved services',
          route: '/delegated-access',
        });
    }
    
    // if (e.permissionName === 'MANAGE_SIGN_IN_PROVIDERS') {
    //   if (this.systemModules.findIndex(x => x.name === 'Manage sign in providers') === -1) {
    //     this.systemModules.push({ name: 'Manage sign in providers', description: 'Add and manage sign in providers', route: '/' });
    //   }
    // }
    if (e.permissionName === 'MANAGE_SUBSCRIPTIONS') {
      if (
        this.otherModules.findIndex(
          (x) => x.name === 'Manage service eligibility'
        ) === -1
      ) {
        if(environment.appSetting.hideSimplifyRole){
          this.otherModules.push({
            name: 'Manage service eligibility',
            description: 'Manage services and roles for organisations',
            route: '/buyer/search',
          });
        } else {
          this.otherModules.push({
            name: 'Manage service eligibility',
            description: 'Manage organisations’ type and services',
            route: '/buyer/search',
          });
        }
      }
      this.otherModules.push({
        name: 'Manage Buyer status requests',
        description: 'Verify and approve or decline Buyer status requests',
        route: '/manage-buyer-both',
      });
    }
    if (e.permissionName === 'ORG_USER_SUPPORT') {
      if (
        this.otherModules.findIndex(
          (x) => x.name === 'Organisation users support'
        ) === -1
      ) {
        this.otherModules.push({
          name: 'Organisation users support',
          description: 'Support for users of other organisations',
          route: '/org-support/search',
        });
      }
    }
  }

  getModuleElementId(moduleName: string) {
    return moduleName.toLowerCase().replace(/ /g, '_');
  }

  public getDelegatedOrganisation(): void {
    this.delegatedApiService.getDeligatedOrg().subscribe({
      next: (data: any) => {
        if(data.detail.delegatedOrgs.length > 0 && this.isDelegation){
          this.systemModules.push({
            name: 'Manage my delegated access',
            description: 'Switch between your primary and delegating Organisation',
            route: '/delegated-organisation',
          });
        }
      },
      error: (error: any) => {
        console.log("error",error)
      },
    });
  }

  public GetOrgDetails() {
    this.ciiService
      .getOrgDetails(localStorage.getItem('permission_organisation_id') || "").toPromise().then((data:any) => {
        this.orgDetails=data.identifier.legalName
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
}
