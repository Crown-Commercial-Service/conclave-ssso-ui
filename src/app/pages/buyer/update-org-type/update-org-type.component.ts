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
  adminSelectionMode: string = "";
  public autoValidationPending: any = null;
  public routeData: any = {}
  constructor(private formBuilder: FormBuilder, private organisationService: OrganisationService, private WrapperOrganisationService: WrapperOrganisationService,
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
    this.rolesToAddAutoValidation = []
  }
  public buyerRemoveList = ['EL_JNR_SUPPLIER', 'EL_SNR_SUPPLIER', 'JAEGGER_SUPPLIER']
  public supplierRemoveList = ['JAEGGER_BUYER', 'ACCESS_CAAAC_CLIENT', 'CAT_USER', 'ACCESS_FP_CLIENT', 'FP_USER']

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.routeData = JSON.parse(atob(params.data));
      if (this.routeData.Id) {
        this.org$ = this.organisationService.getById(this.routeData.Id).pipe(share());
        this.org$.subscribe({
          next: data => {
            this.organisation = data;
            this.autoValidationPending = data.isAutovalidationPending
            this.adminSelectionMode = data.supplierBuyerType.toString();
            if (data.isAutovalidationPending === true) {
              this.autoValidationPending = true
            } else {
              this.autoValidationPending = null
            }
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
  public onSelect(type: string | number, accessFrom: string) {
    this.roles.map((role: any) => {
      role.isDeleted = false
    })
    if (type == 1) {
      this.hideBuyerRole()
      if (accessFrom === "html") {
        this.checkRoleMatrixInAddRoles(1)
        this.checkRoleMatrixInDeleteRoles(1)
      }
    }
    else if (type == 0) {
      this.hideSupplierRole()
      if (accessFrom === "html") {
        this.checkRoleMatrixInAddRoles(0)
        this.checkRoleMatrixInDeleteRoles(0)
        this.checkAddRoleForSupplierAndBuyer(0)
      }
    }
    else if (type == 2 && accessFrom === "html") {
      this.checkRoleMatrixInDeleteRoles(2)
    }

    if (accessFrom === "html" && type != this.adminSelectionMode) {
      this.preTickRoles(type)
    }
  }


  /**
   * hide role which not part of supplier
   * @param orgType 
   * @param accessFrom 
   */
  private hideSupplierRole(): void {
    this.supplierRemoveList.map((removeRoleKey: any) => {
      this.roles.map((role: any, index) => {
        if (role.roleKey == removeRoleKey) {
          if (role.enabled && !role.autoValidate) {
            role.softDelete = true
            let apperaredInDelete: any = this.rolesToDelete.find((existRole: { roleKey: any; }) => existRole.roleKey == role.roleKey)
            if (apperaredInDelete === undefined) {
              this.rolesToDelete.push(role);
            }
          }
          role.isDeleted = true
        }
      })
    })
  }

  /**
   * hide role which not part of buyer
   * @param orgType 
   * @param accessFrom 
   */
  private hideBuyerRole() {
    this.buyerRemoveList.map((removeRoleKey: any) => {
      this.roles.map((buyerRoles: any, index) => {
        if (buyerRoles.roleKey == removeRoleKey) {
          buyerRoles.softDelete = true
          if (buyerRoles.enabled && !buyerRoles.autoValidate) {
            let apperaredInDelete: any = this.rolesToDelete.find((existRole: { roleKey: any; }) => existRole.roleKey == buyerRoles.roleKey)
            if (apperaredInDelete === undefined) {
              this.rolesToDelete.push(buyerRoles);
            }
          }
          buyerRoles.isDeleted = true
        }
      })
    })

    this.buyerRemoveList.map((removeRoleKey: any) => {
      this.rolesToAdd.map((buyerRoles: any, index) => {
        if (buyerRoles.roleKey == removeRoleKey) {
          this.rolesToAdd.splice(index, 1);
        }
      })
    })
  }


  /**
   * pre tick role based on api Eligibilty responce
   * @param type 
   */
  public preTickRoles(type: any): void {
    this.roles.forEach((f: any) => {
      if (f.autoValidationRoleTypeEligibility.length != 0) {
        f.autoValidationRoleTypeEligibility.forEach((x: any) => {
          if (x == type && f.enabled == false) {
            f.enabled = true; f.autoValidate = true
            let alreadyExist: any = this.rolesToAdd.find((existRole: { roleKey: any; }) => existRole.roleKey == f.roleKey)
            if (alreadyExist === undefined) {
              this.rolesToAdd.push(f);
            }
            let apperaredInDelete: any = this.rolesToDelete.find((existRole: { roleKey: any; }) => existRole.roleKey == f.roleKey)
            if (apperaredInDelete === undefined) {
              this.rolesToAddAutoValidation?.push(f)
            }
          }
        })
      }
    })
    if (this.organisation.supplierBuyerType == '0' && type == '1') {
      let ACCESS_JAGGAER = this.rolesToAddAutoValidation.find((element: { roleKey: any; }) => element.roleKey == 'ACCESS_JAGGAER')
      let JAGGAER_USER = this.rolesToAddAutoValidation.find((element: { roleKey: any; }) => element.roleKey == 'JAGGAER_USER')
      let ACCESS_JAGGAER_Delete: any = this.rolesToDelete.find((existRole: { roleKey: any; }) => existRole.roleKey == 'ACCESS_JAGGAER')
      let JAGGAER_USER_Delete: any = this.rolesToDelete.find((existRole: { roleKey: any; }) => existRole.roleKey == 'JAGGAER_USER')

      if (ACCESS_JAGGAER === undefined && ACCESS_JAGGAER_Delete === undefined) {
        let accessJagger: any = this.roles.find((element: { roleKey: any; }) => element.roleKey == 'ACCESS_JAGGAER')
        this.rolesToAddAutoValidation?.push(accessJagger)
        accessJagger.autoValidate = true
      }
      if (JAGGAER_USER === undefined && JAGGAER_USER_Delete === undefined) {
        let jaggerUser: any = this.roles.find((element: { roleKey: any; }) => element.roleKey == 'JAGGAER_USER')
        this.rolesToAddAutoValidation?.push(jaggerUser)
        jaggerUser.autoValidate = true
      }
    }
  }


  /**
   * checking role when switching 
   * @param orgType 
   */
  public checkRoleMatrixInAddRoles(orgType: any): void {
    const dublicateRoleAddArray: Role[] = []
    this.rolesToAdd.forEach((addedRole: Role, index) => {
      if (this.orgRoleEligibilty(orgType, addedRole)) {
        dublicateRoleAddArray.push(addedRole)
      } else {
        this.rolesToAdd.splice(index, 1)
      }
    })
    this.rolesToAdd = dublicateRoleAddArray
  }




  public orgRoleEligibilty(orgType: any, role: any) {
    if (orgType == '0') {
      if (role.tradeEligibility == '0' || role.tradeEligibility == '2') {
        return true
      }
    } else if (orgType == '1') {
      if (role.tradeEligibility == '1' || role.tradeEligibility == '2') {
        return true
      }
    }
    else if (orgType == '2') {
      if (role.tradeEligibility == '0' || role.tradeEligibility == '1' || role.tradeEligibility == '2') {
        return true
      }
    }
    return false
  }


  public checkRoleMatrixInDeleteRoles(orgType: any): void {
    if (orgType === 2) {
      this.supplierRemoveList.forEach((dItems) => {
        this.rolesToDelete.map((aRole: any, index) => {
          if (aRole.roleKey === dItems && aRole.softDelete === true) {
            this.rolesToDelete.splice(index, 1)
          }
        })
      })
      this.buyerRemoveList.forEach((dItems) => {
        this.rolesToDelete.map((aRole: any, index) => {
          if (aRole.roleKey === dItems && aRole.softDelete === true) {
            this.rolesToDelete.splice(index, 1)
          }
        })
      })
    }
    else if (orgType === 0) {
      this.buyerRemoveList.forEach((dItems) => {
        this.rolesToDelete.map((aRole: any, index) => {
          if (aRole.roleKey === dItems && aRole.softDelete === true) {
            this.rolesToDelete.splice(index, 1)
          }
        })
      })
    } else if (orgType === 1) {
      this.supplierRemoveList.forEach((dItems) => {
        this.rolesToDelete.map((aRole: any, index) => {
          if (aRole.roleKey === dItems && aRole.softDelete === true) {
            this.rolesToDelete.splice(index, 1)
          }
        })
      })
    }
  }

  public checkAddRoleForSupplierAndBuyer(selectedOrg: any) {
    this.supplierRemoveList.forEach((rItems) => {
      this.rolesToAdd.map((aRole, index) => {
        if (aRole.roleKey === rItems) {
          this.rolesToAdd.splice(index, 1)
        }
      })
    })
  }



  /**
   *  trade elegibity checking for all listed roles
   * @param role getting from html when *ngFor happen
   * @returns return boolean value based on condtion
   */
  public tradeEligibilityStatus(role: any) {
    if (this.adminSelectionMode == '0') {
      if (role.tradeEligibility == '0' || role.tradeEligibility == '2') {
        return true
      }
    } else if (this.adminSelectionMode == '1') {
      if (role.tradeEligibility == '1' || role.tradeEligibility == '2') {
        return true
      }
    }
    else if (this.adminSelectionMode == '2') {
      if (role.tradeEligibility == '0' || role.tradeEligibility == '1' || role.tradeEligibility == '2') {
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
    if (role.autoValidate === true && !event.target.checked) {
      const index = this.rolesToAddAutoValidation?.indexOf(role);
      this.rolesToAddAutoValidation?.splice(index, 1)
      this.rolesToAdd.splice(index, 1);
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
      toAutoValid: this.rolesToAddAutoValidation,
      orgType: this.adminSelectionMode,
      hasChanges: (this.rolesToAdd.length === 0 && this.rolesToDelete.length === 0 && this.organisation.supplierBuyerType == this.adminSelectionMode) ? false : true,
      autoValidate: true
    };
    if ((this.adminSelectionMode == '1' || this.adminSelectionMode == '2') && this.organisation.supplierBuyerType == '0') {
      this.WrapperOrganisationService.getAutoValidationStatus(this.organisation.ciiOrganisationId).toPromise().then((responce: any) => {
        selection.autoValidate = responce.autoValidationSuccess
        let preTickRemoved: any = []
        if (!responce.autoValidationSuccess) {
          if (this.organisation.supplierBuyerType == '0' && this.adminSelectionMode == '1') {
            let ACCESS_JAGGAER = selection.toDelete.find((element: { roleKey: any; }) => element.roleKey == 'ACCESS_JAGGAER')
            let JAGGAER_USER = selection.toDelete.find((element: { roleKey: any; }) => element.roleKey == 'JAGGAER_USER')
            if (ACCESS_JAGGAER === undefined) {
              let accessJagger: any = this.roles.find((element: { roleKey: any; }) => element.roleKey == 'ACCESS_JAGGAER')
              selection.toDelete.push(accessJagger)
            }
            if (JAGGAER_USER === undefined) {
              let jaggerUser: any = this.roles.find((element: { roleKey: any; }) => element.roleKey == 'JAGGAER_USER')
              selection.toDelete.push(jaggerUser)
            }
          }

          this.rolesToAdd.forEach((f: any) => {
            if (!f.autoValidate) {
              preTickRemoved.push(f)
            }
          })
          selection.toAdd = preTickRemoved
        }
        localStorage.setItem(`mse_org_${this.organisation.ciiOrganisationId}`, JSON.stringify(selection));
        let data = {
          ciiOrganisationId: this.organisation.ciiOrganisationId,
          companyHouseId: this.routeData.companyHouseId,
        }
        this.router.navigateByUrl(`update-org-type/confirm-changes?data=` + btoa(JSON.stringify(data)))
      }).catch(error => {
        console.log(error);
      });
    } else {
      let data = {
        ciiOrganisationId: this.organisation.ciiOrganisationId,
        companyHouseId: this.routeData.companyHouseId,
      }
      localStorage.setItem(`mse_org_${this.organisation.ciiOrganisationId}`, JSON.stringify(selection));
      this.router.navigateByUrl(`update-org-type/confirm-changes?data=` + btoa(JSON.stringify(data)))
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
  public getOrgRoles() {
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
            localStorage.setItem('defaultRole', JSON.stringify(this.roles))
            setTimeout(() => {
              this.onSelect(this.adminSelectionMode, 'none')
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