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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit {
  public OrgDetails: any = {};
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

  constructor(
    protected uiStore: Store<UIState>,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private organisationService: OrganisationService,
    private wrapperUserService: WrapperUserService,
    private readonly tokenService: TokenService,
    private ciiService: ciiService,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper
  ) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
    this.authService.getPermissions('HOME').toPromise().then((response) => {
      this.servicePermissions = response;
        this.authService.getCcsServices().toPromise().then((data: any) => {
            this.ccsServices = data;
            response.forEach((e: any, i: any) => {
              this.loadActivities(e);
            });
              this.GetOrgDetails();
              this.loadServices();
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
        this.otherModules.push({
          name: 'Delegated access',
          description: 'Manage delegated access to your approved services',
          route: '/delegated-access',
        });
        this.otherModules.push({
          name: 'Manage my delegated access',
          description: 'Switch between your primary and delegating Organisation',
          route: '/delegated-organisation',
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
        this.otherModules.push({
          name: 'Manage service eligibility',
          description: 'Manage services and roles for organisations',
          route: '/buyer/search',
        });
      }
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

  public GetOrgDetails() {
    this.ciiService
      .getOrgDetails(this.ciiOrganisationId).toPromise().then((data) => {
        this.OrgDetails=data
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
}
