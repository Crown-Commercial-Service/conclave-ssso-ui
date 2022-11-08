import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Role } from 'src/app/models/organisationGroup';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
@Component({
  selector: 'app-update-org-type',
  templateUrl: './update-org-type.component.html',
  styleUrls: ['./update-org-type.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None
})
export class UpdateOrgTypeComponent implements OnInit {

  public organisation: any;
  public org$!: Observable<any>;
  userProfileForm: FormGroup;
  orgRoles: Role[];
  roles: Role[];
  public orgEligableRoles$!: Observable<Role[]>;
  public orgRoles$!: Observable<Role[]>;
  eRoles: Role[];
  rolesToAdd: Role[];
  rolesToDelete: Role[];
  adminSelectionMode : string = "";

  constructor(private formBuilder: FormBuilder, private organisationService: OrganisationService,private WrapperOrganisationService:WrapperOrganisationService,
    private wrapperConfigService: WrapperConfigurationService, private router: Router, private route: ActivatedRoute,
    protected uiStore: Store<UIState>, private organisationGroupService: WrapperOrganisationGroupService, 
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    this.orgRoles = [];
    this.eRoles = [];
    this.roles = [];
    this.userProfileForm = this.formBuilder.group({
      userTitle: ['', null],
    });
    this.rolesToAdd = [];
    this.rolesToDelete = [];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.org$ = this.organisationService.getById(params.id).pipe(share());
        this.org$.subscribe({
          next: data => {
            this.organisation = data;
            this.adminSelectionMode = data.supplierBuyerType.toString();
            this.getOrgRoles();
          }
        });
      }
    });
  }

  public onSelect(type: number) {
  this.rolesToAdd = [];
  this.rolesToDelete = [];
  this.roles.forEach((f:any)=>{
      if(f.autoValidationRoleTypeEligibility.length != 0){
        f.autoValidationRoleTypeEligibility.forEach((x:any)=>{
         if(x == type){
          f.enabled = true
          this.rolesToAdd.push(f);
         }
        })
      }
  })
  }

  onChange(event: any, defaultValue: any, role: any) {
    if (defaultValue === true && !event.target.checked) {
      this.rolesToDelete.push(role);
    }
    else if (defaultValue == true && event.target.checked) {
      const index = this.rolesToDelete.indexOf(role);
      if (index > -1) {
        this.rolesToDelete.splice(index, 1);
      }
    }
    if (defaultValue === false && event.target.checked) {
      this.rolesToAdd.push(role);
    }
    else if (defaultValue == false && !event.target.checked) {
      const index = this.rolesToAdd.indexOf(role);
      if (index > -1) {
        this.rolesToAdd.splice(index, 1);
      }
    }
  }

  public onSubmitClick() {
    let selection = {
      org: this.organisation,
      toDelete: this.rolesToDelete,
      toAdd: this.rolesToAdd,
      orgType:this.adminSelectionMode,
      hasChanges: (this.organisation.supplierBuyerType === this.adminSelectionMode && this.rolesToAdd.length === 0 && this.rolesToDelete.length === 0) ? false : true
    };
    this.WrapperOrganisationService.getAutoValidationStatus(this.organisation.ciiOrganisationId).toPromise().then(() => {
       localStorage.setItem(`mse_org_${this.organisation.ciiOrganisationId}`, JSON.stringify(selection));
       this.router.navigateByUrl(`update-org-type/confirm-changes/${this.organisation.ciiOrganisationId}`)
      }).catch(error => {
        console.log(error);
       });
  }

  public onCancelClick() {
    localStorage.removeItem(`mse_org_${this.organisation.ciiOrganisationId}`);
    this.router.navigateByUrl('buyer/search');
  }

  getOrgRoles(){
    this.orgRoles$ = this.wrapperConfigService.getRoles().pipe(share());
    this.orgRoles$.subscribe({
      next: (orgRoles: Role[]) => {
        this.roles = orgRoles;
        this.orgEligableRoles$ = this.organisationGroupService.getGroupOrganisationRoles(this.organisation.ciiOrganisationId).pipe(share());
        this.orgEligableRoles$.subscribe({
          next: (eRoles: Role[]) => {
            this.roles.forEach((r) => {
              r.enabled = eRoles.some(x => x.roleName == r.roleName && x.serviceName == r.serviceName);
            });
            this.eRoles = eRoles;
            setTimeout(() => {
            }, 100);
          },
          error: (err: any) => {
            console.log(err)
          }
        });
      },
      error: (err: any) => {
        console.log(err)
      }
    });
  }
}
