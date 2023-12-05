import {ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
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
@Component({
  selector: 'app-success-org-service',
  templateUrl: './success-org-service.component.html',
  styleUrls: ['./success-org-service.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
})
export class SuccessOrgServiceComponent implements OnDestroy {

  public org: any;
  public org$!: Observable<any>;
  public changes: any;
  public toAdd:any = []
  public toAutoValid:any = []
  public toDelete:any = []
  userServiceTableHeaders = ['NAME'];
  userServiceColumnsToDisplay = ['accessRoleName',]
  constructor(private cf: ChangeDetectorRef, private organisationService: OrganisationService, 
    private wrapperOrgService: WrapperOrganisationService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected scrollHelper: ScrollHelper) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.org$ = this.organisationService.getById(params.id).pipe(share());
        this.org$.subscribe({
          next: data => {
            this.org = data;
            this.changes = JSON.parse(localStorage.getItem(`mse_org_${this.org.ciiOrganisationId}`)+'');
            this.updateTableData()
            if(!this.changes){
              this.router.navigateByUrl('home');
              return
            }
          }
        });
      }
    });
  }

  private updateTableData(){
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

  ngOnDestroy(): void {
    localStorage.removeItem('defaultRole')
    localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
  }

  public onBackClick() {
    localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
    this.router.navigateByUrl('update-org-type/confirm/' + this.org.ciiOrganisationId);
  }

}
