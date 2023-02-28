import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-confirm-org-service',
  templateUrl: './confirm-org-service.component.html',
  styleUrls: ['./confirm-org-service.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmOrgServiceComponent  extends BaseComponent {
  public org: any;
  public org$!: Observable<any>;
  public changes: any;
  private routeData:any = {}
  public toAdd:any = []
  public toAutoValid:any = []
  public toDelete:any = []
  userServiceTableHeaders = ['NAME'];
  userServiceColumnsToDisplay = ['accessRoleName',]
  constructor(private cf: ChangeDetectorRef, private organisationService: OrganisationService, 
    private wrapperOrgService: WrapperOrganisationService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore,viewportScroller,scrollHelper);
    this.route.queryParams.subscribe(params => {
      this.routeData = JSON.parse(atob(params.data))
      if (this.routeData.ciiOrganisationId) {
        this.org$ = this.organisationService.getById(this.routeData.ciiOrganisationId).pipe(share());
        this.org$.subscribe({
          next: data => {
            this.org = data;
            this.changes = JSON.parse(localStorage.getItem(`mse_org_${this.org.ciiOrganisationId}`)+'');
            this.tableInitialor()
          }
        });
      }
    });
  }

 private tableInitialor(){
  debugger
  if(this.changes.toAdd.length > 0){
    this.changes.toAdd.forEach((addRole:any)=>{
      this.toAdd.push({
        accessRoleName: addRole.roleName,
        serviceName: addRole.serviceName,
        description:addRole.description,
        serviceView:true
      });
    })
  }
  if(this.changes.toAutoValid.length > 0){
    this.changes.toAutoValid.forEach((autoValid:any)=>{
      this.toAutoValid.push({
        accessRoleName: autoValid.roleName,
        serviceName: autoValid.serviceName,
        description:autoValid.description,
        serviceView:true
      });
    })
  }
  if(this.changes.toDelete.length > 0){
    this.changes.toDelete.forEach((deleteRole:any)=>{
      this.toDelete.push({
        accessRoleName: deleteRole.roleName,
        serviceName: deleteRole.serviceName,
        description:deleteRole.description,
        serviceView:true
      });
    })
  }
 }
  

  public onSubmitClick() {
    const model = {
      orgType:parseInt(this.changes.orgType),
      serviceRoleGroupToDelete: this.changes.toDelete,
      serviceRoleGroupToAdd: this.changes.toAdd,
      serviceRoleGroupToAutoValid: this.changes.toAutoValid,
      companyHouseId:this.routeData.companyHouseId
    };

    this.wrapperOrgService.updateOrgRoles(this.org.ciiOrganisationId, JSON.stringify(model),'servicerolegroups/switch').toPromise().then(() => {
      this.router.navigateByUrl(`update-org-type/buyer-success/${this.org.ciiOrganisationId}`);
    }).catch(error => {
      console.log(error);
      this.router.navigateByUrl(`buyer/error`);
    });
  }

  public onCancelClick() {
    this.router.navigateByUrl('buyer/search');
  }

  public onBackClick() {
    localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
    let data = {
      companyHouseId:this.routeData.companyHouseId,
      Id:this.org.ciiOrganisationId
    }
    if(environment.appSetting.hideSimplifyRole){
      this.router.navigateByUrl('update-org-type/confirm?data=' + btoa(JSON.stringify(data)));
    } else {
      this.router.navigateByUrl('update-org-services/confirm?data=' + btoa(JSON.stringify(data)));
    }
  }
}
