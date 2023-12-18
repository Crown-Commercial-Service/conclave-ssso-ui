import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-confirm-org-service',
  templateUrl: './confirm-org-service.component.html',
  styleUrls: ['./confirm-org-service.component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmOrgServiceComponent extends BaseComponent {
  public org: any;
  public org$!: Observable<any>;
  public changes: any;
  public routeData: any = {};
  public toAdd: any = [];
  public toAutoValid: any = [];
  public toDelete: any = [];
  userServiceTableHeaders = ['NAME'];
  userServiceColumnsToDisplay = ['accessRoleName'];
  constructor(
    private cf: ChangeDetectorRef,
    private organisationService: OrganisationService,
    public wrapperOrgService: WrapperOrganisationService,
    public router: Router,
    private route: ActivatedRoute,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private dataLayerService: DataLayerService,
    private sessionService:SessionService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.route.queryParams.subscribe((params) => {
      this.routeData = JSON.parse(atob(params.data));
      if (this.routeData.ciiOrganisationId) {
        this.org$ = this.organisationService
          .getById(this.routeData.ciiOrganisationId)
          .pipe(share());
        this.org$.subscribe({
          next: (data) => {
            this.org = data;
            this.changes = JSON.parse(
              localStorage.getItem(`mse_org_${this.org.ciiOrganisationId}`) + ''
            );
            this.updateTableData();
          },
        });
      }
    });
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
  }

  public updateTableData() {
    if (this.changes.toAdd.length > 0) {
      this.changes.toAdd.forEach((addRole: any) => {
        this.toAdd.push({
          accessRoleName: addRole.roleName,
          serviceName: addRole.serviceName,
          description: addRole.description,
          serviceView: true,
        });
      });
    }
    if (this.changes.toAutoValid.length > 0) {
      this.changes.toAutoValid.forEach((autoValid: any) => {
        this.toAutoValid.push({
          accessRoleName: autoValid.roleName,
          serviceName: autoValid.serviceName,
          description: autoValid.description,
          serviceView: true,
        });
      });
    }
    if (this.changes.toDelete.length > 0) {
      this.changes.toDelete.forEach((deleteRole: any) => {
        this.toDelete.push({
          accessRoleName: deleteRole.roleName,
          serviceName: deleteRole.serviceName,
          description: deleteRole.description,
          serviceView: true,
        });
      });
    }
  }

  public onSubmitClick() {
    const model = {
      orgType: parseInt(this.changes.orgType),
      serviceRoleGroupsToDelete: this.filterRoleId(this.changes.toDelete),
      serviceRoleGroupsToAdd: this.filterRoleId(this.changes.toAdd),
      serviceRoleGroupsToAutoValid: this.filterRoleId(this.changes.toAutoValid),
      companyHouseId: this.routeData.companyHouseId,
    };
    this.wrapperOrgService
      .updateOrgRoles(
        this.org.ciiOrganisationId,
        JSON.stringify(model),
        'validation/auto/switch/service-role-groups'
      )
      .toPromise()
      .then(() => {
        this.router.navigateByUrl(
          `org-service/success/${this.org.ciiOrganisationId}`
        );
      })
      .catch((error) => {
        console.log(error);
        this.router.navigateByUrl(`buyer/error`);
      });
      this.pushDataLayerEvent();
  }

  public filterRoleId(roleArray: any) {
    let roleIdArray: any = [];
    roleArray.forEach((f: any) => {
      roleIdArray.push(f.roleId);
    });
    return roleIdArray;
  }

  public onCancelClick() {
    this.router.navigateByUrl('buyer-supplier/search');
  }

  public onBackClick() {
    localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
    let data = {
      companyHouseId: this.routeData.companyHouseId,
      Id: this.org.ciiOrganisationId,
    };
    if (environment.appSetting.hideSimplifyRole) {
      this.router.navigateByUrl(
        'update-org-type/confirm?data=' + btoa(JSON.stringify(data))
      );
    } else {
      this.router.navigateByUrl(
        'update-org-services/confirm?data=' + btoa(JSON.stringify(data))
      );
    }
    this.pushDataLayerEvent()
  }

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Review - Manage Buyers"
    });
  }
}
