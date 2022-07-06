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
  private DefaultChanges:any;
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
            this.DefaultChanges=JSON.parse(localStorage.getItem(`mse_org_${this.org.ciiOrganisationId}`)+'');
            console.log("DefaultChanges",this.DefaultChanges)
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
    this.changes.toDelete.map((f:any)=>{
      switch (f.roleKey) {
        case 'CAT_USER': {
          if (f.roleName === 'CAS User') {
            f.roleName = 'Contract Award Service (CAS)';
            f.serviceName = null;
          }
          break;
        }
        case 'ACCESS_CAAAC_CLIENT': {
          if (f.roleName === 'Access Contract Award Service') {
            f.roleName = 'Contract Award Service (CAS)';
            f.serviceName = null;
          }
          break;
        }
        case 'JAEGGER_SUPPLIER': {
          if (f.roleName === 'Jaggaer Supplier') {
            f.roleName = 'eSourcing Service as a supplier';
            f.serviceName = null;
          }
          break;
        }
        case 'JAEGGER_BUYER': {
          if (f.roleName === 'Jaggaer Buyer') {
            f.roleName = 'eSourcing Service as a buyer';
            f.serviceName = null;
          }
          break;
        }
        case 'JAGGAER_USER': {
          if (f.roleName === 'Jaggaer User') {
            f.roleName = 'eSourcing Service';
            f.serviceName = null;
          }
          break;
        }
        case 'ACCESS_JAGGAER': {
          if (f.roleName === 'Access Jaggaer') {
            f.roleName = 'eSourcing Service';
            f.serviceName = null;
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
    this.changes.toAdd.forEach((f:any)=>{
      switch (f.roleKey) {
        case 'CAT_USER': {
          if (f.roleName === 'CAS User') {
            f.roleName = 'Contract Award Service (CAS)';
            f.serviceName = null;
          }
          break;
        }
        case 'ACCESS_CAAAC_CLIENT': {
          if (f.roleName === 'Access Contract Award Service') {
            f.roleName = 'Contract Award Service (CAS)';
            f.serviceName = null;
          }
          break;
        }
        case 'JAEGGER_SUPPLIER': {
          if (f.roleName === 'Jaggaer Supplier') {
            f.roleName = 'eSourcing Service as a supplier';
            f.serviceName = null;
          }
          break;
        }
        case 'JAEGGER_BUYER': {
          if (f.roleName === 'Jaggaer Buyer') {
            f.roleName = 'eSourcing Service as a buyer';
            f.serviceName = null;
          }
          break;
        }
        case 'JAGGAER_USER': {
          if (f.roleName === 'Jaggaer User') {
            f.roleName = 'eSourcing Service';
            f.serviceName = null;
          }
          break;
        }
        case 'ACCESS_JAGGAER': {
          if (f.roleName === 'Access Jaggaer') {
            f.roleName = 'eSourcing Service';
            f.serviceName = null;
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
      isBuyer: this.DefaultChanges.rightToBuy,
      rolesToDelete: this.DefaultChanges.toDelete,
      rolesToAdd: this.DefaultChanges.toAdd,
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
