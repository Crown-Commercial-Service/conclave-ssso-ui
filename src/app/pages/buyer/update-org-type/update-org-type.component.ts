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
  rolesToAddAutoValidation: Role[] | any;
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

/**
 * select radio button
 * @param type supplier, buyer, both
 * supplier = 0
 * buyer    = 1
 * both     =  2
 */
  public onSelect(type: string | number,accessfrom:string) {
  const buyerRemoveList=['EL_JNR_SUPPLIER','EL_SNR_SUPPLIER','JAEGGER_SUPPLIER']
  const supplierRemoveList=['JAEGGER_BUYER','ACCESS_CAAAC_CLIENT','CAT_USER','ACCESS_FP_CLIENT','FP_USER']
  this.rolesToAdd = [];
  this.rolesToDelete = [];
  this.rolesToAddAutoValidation = []
  this.roles = JSON.parse((localStorage.getItem('defaultRole')) || '')
  //buyer roles hidden 
   if(type == 1){
      buyerRemoveList.map((removeRoleKey:any)=>{
      this.roles.map((buyerRoles,index)=>{
       if(buyerRoles.roleKey == removeRoleKey){
        if(accessfrom === "html"){
          this.rolesToDelete.push(buyerRoles);
        }
        this.roles.splice(index,1)
       }
      })
    })
    }
    // supplier roles hidden
    else if(type == 0){
      supplierRemoveList.map((removeRoleKey:any)=>{
        this.roles.map((buyerRoles,index)=>{
         if(buyerRoles.roleKey == removeRoleKey && buyerRoles.enabled === false){
          this.roles.splice(index,1)
         }
        })
      })
    }
    
    if(accessfrom === "html" && type != this.adminSelectionMode){
      this.preTickRoles(type)
    }
  }


  public preTickRoles(type:any):void{
  this.roles.forEach((f:any)=>{
      if(f.autoValidationRoleTypeEligibility.length != 0){
        f.autoValidationRoleTypeEligibility.forEach((x:any)=>{
         if(x == type && f.enabled == false){
           f.enabled = true
           f.autoValidate = true
          this.rolesToAdd.push(f); 
          this.rolesToAddAutoValidation?.push(f)
         }
        })
      }
   })
  }

/**
 *  trade elegibity checking for all listed roles
 * @param role getting from html when *ngFor happen
 * @returns return boolean value based on condtion
 */
  public tradeEligibilityStatus(role:any){
    if(this.adminSelectionMode == '0'){
      if(role.tradeEligibility == '0' || role.tradeEligibility == '2'){
        return true
      }
    } else if (this.adminSelectionMode == '1'){
      if(role.tradeEligibility == '1' || role.tradeEligibility == '2'){
        return true
      }
    }
      else if (this.adminSelectionMode == '2'){
        if(role.tradeEligibility == '0' || role.tradeEligibility == '1' || role.tradeEligibility == '2'){
          return true
        }
    }
    return false
  }


/**
 * Check box evenets 
 * @param event oberverving HTML DOM event 
 * @param defaultValue Init Value
 * @param role object of role
 */
  public onChange(event: any, defaultValue: any, role: any) {
    if(role.autoValidate === true && !event.target.checked){
      const index = this.rolesToAddAutoValidation?.indexOf(role);
      this.rolesToAddAutoValidation?.splice(index,1)
    }
    else if (defaultValue === true && !event.target.checked) {
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

  /**
   * On submit save call.
   */
  public onSubmitClick() {
    let selection = {
      org: this.organisation,
      toDelete: this.rolesToDelete,
      toAdd: this.rolesToAdd,
      toAutoValid : this.rolesToAddAutoValidation,
      orgType:this.adminSelectionMode,
      hasChanges: (this.rolesToAdd.length === 0 && this.rolesToDelete.length === 0 && this.organisation.supplierBuyerType == this.adminSelectionMode) ? false : true,
      autoValidate:true
    };
    if((this.adminSelectionMode == '1' || this.adminSelectionMode == '2' ) && this.organisation.supplierBuyerType == '0'){
      this.WrapperOrganisationService.getAutoValidationStatus(this.organisation.ciiOrganisationId).toPromise().then((responce:any) => {
         selection.autoValidate = responce.autoValidationSuccess
         localStorage.setItem(`mse_org_${this.organisation.ciiOrganisationId}`, JSON.stringify(selection));
         this.router.navigateByUrl(`update-org-type/confirm-changes/${this.organisation.ciiOrganisationId}`)
        }).catch(error => {
          console.log(error);
         });
     } else {
         localStorage.setItem(`mse_org_${this.organisation.ciiOrganisationId}`, JSON.stringify(selection));
        this.router.navigateByUrl(`update-org-type/confirm-changes/${this.organisation.ciiOrganisationId}`)
     }
  }


/**
 * cancel button call , removing all the local storage details
 */
  public onCancelClick() {
    localStorage.removeItem(`mse_org_${this.organisation.ciiOrganisationId}`);
    this.router.navigateByUrl('buyer/search');
  }


  /**
   * getting all roles and find elegible role call.
   */
  public getOrgRoles(){
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
            localStorage.setItem('defaultRole',JSON.stringify(this.roles))
            setTimeout(() => {
            this.onSelect(this.adminSelectionMode,'none')
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
