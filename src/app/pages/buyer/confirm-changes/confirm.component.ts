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

@Component({
  selector: 'app-buyer-confirm-changes',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyerConfirmChangesComponent extends BaseComponent {

  public org: any;
  public org$!: Observable<any>;
  public changes: any;
  
  constructor(private cf: ChangeDetectorRef, private organisationService: OrganisationService, 
    private wrapperOrgService: WrapperOrganisationService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore,viewportScroller,scrollHelper);
    this.route.params.subscribe(params => {
      if (params.id) {
        this.org$ = this.organisationService.getById(params.id).pipe(share());
        this.org$.subscribe({
          next: data => {
            this.org = data;
            this.changes = JSON.parse(localStorage.getItem(`mse_org_${this.org.ciiOrganisationId}`)+'');
            if(this.changes.toAdd.length != 0){
             this.FilterAddRoles()
           }else if(this.changes.toDelete.length != 0){
            this.FilterDeleteRoles()
           }
          }
        });
      }
    });
  }

  private FilterDeleteRoles():void{
    this.changes.toDelete.map((orgRole:any)=>{
      switch (orgRole.roleKey) {
        case 'CAT_USER': {
          if (orgRole.roleName === 'Contract Award Service (CAS)') {
            orgRole.roleName = 'Contract Award Service (CAS) - service';
            orgRole.serviceName = 'Contract Award Service (CAS)';
          }
          break;
        }
        case 'ACCESS_CAAAC_CLIENT': {
          if (orgRole.roleName === 'Contract Award Service (CAS)') {
            orgRole.roleName = 'Contract Award Service (CAS) - dashboard';
            orgRole.serviceName = 'Contract Award Service (CAS)';
          }
          break;
        }
        case 'JAEGGER_SUPPLIER': {
          if (orgRole.roleName === 'eSourcing Service as a supplier') {
            orgRole.roleName = 'eSourcing Service as a supplier';
            orgRole.serviceName = 'eSourcing Service';
          }
          break;
        }
        case 'JAEGGER_BUYER': {
          if (orgRole.roleName === 'eSourcing Service as a buyer') {
            orgRole.roleName = 'eSourcing Service as a buyer';
            orgRole.serviceName = 'eSourcing Service ';
          }
          break;
        }
        case 'JAGGAER_USER': {
          if (orgRole.roleName === 'eSourcing Service') {
            orgRole.roleName = 'eSourcing Service - service';
            orgRole.serviceName = 'eSourcing Service';
          }
          break;
        }
        case 'ACCESS_JAGGAER': {
          if (orgRole.roleName === 'eSourcing Service') {
            orgRole.roleName = 'eSourcing Service - dashboard';
            orgRole.serviceName = 'eSourcing Service';
          }
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    })
  }

  private FilterAddRoles():void{
    this.changes.toAdd.forEach((orgRole:any)=>{
      switch (orgRole.roleKey) {
        case 'CAT_USER': {
          if (orgRole.roleName === 'Contract Award Service (CAS)') {
            orgRole.roleName = 'Contract Award Service (CAS) - service';
            orgRole.serviceName = 'Contract Award Service (CAS)';
          }
          break;
        }
        case 'ACCESS_CAAAC_CLIENT': {
          if (orgRole.roleName === 'Contract Award Service (CAS)') {
            orgRole.roleName = 'Contract Award Service (CAS) - dashboard';
            orgRole.serviceName = 'Contract Award Service (CAS)';
          }
          break;
        }
        case 'JAEGGER_SUPPLIER': {
          if (orgRole.roleName === 'eSourcing Service as a supplier') {
            orgRole.roleName = 'eSourcing Service as a supplier';
            orgRole.serviceName = 'eSourcing Service';
          }
          break;
        }
        case 'JAEGGER_BUYER': {
          if (orgRole.roleName === 'eSourcing Service as a buyer') {
            orgRole.roleName = 'eSourcing Service as a buyer';
            orgRole.serviceName = 'eSourcing Service ';
          }
          break;
        }
        case 'JAGGAER_USER': {
          if (orgRole.roleName === 'eSourcing Service') {
            orgRole.roleName = 'eSourcing Service - service';
            orgRole.serviceName = 'eSourcing Service';
          }
          break;
        }
        case 'ACCESS_JAGGAER': {
          if (orgRole.roleName === 'eSourcing Service') {
            orgRole.roleName = 'eSourcing Service - dashboard';
            orgRole.serviceName = 'eSourcing Service';
          }
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    })
  }
  public onSubmitClick() {
    const model = {
      isBuyer: this.changes.rightToBuy,
      rolesToDelete: this.changes.toDelete,
      rolesToAdd: this.changes.toAdd,
    };
    this.wrapperOrgService.updateOrgRoles(this.org.ciiOrganisationId, JSON.stringify(model)).toPromise().then(() => {
    localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
      this.router.navigateByUrl(`buyer/success`);
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
    this.router.navigateByUrl('buyer/confirm/' + this.org.ciiOrganisationId);
  }
}
