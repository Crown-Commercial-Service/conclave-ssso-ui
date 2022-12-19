import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { CiiOrganisationDto, OrganisationRegisterDto } from 'src/app/models/organisation';
import { UserTitleEnum } from 'src/app/constants/enum';
import { PatternService } from 'src/app/shared/pattern.service';

@Component({
  selector: 'app-manage-organisation-registration-add-user',
  templateUrl: './manage-organisation-registration-add-user.component.html',
  styleUrls: ['./manage-organisation-registration-add-user.component.scss']
})
export class ManageOrgRegAddUserComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  submitted: boolean = false;
  userTitleEnum = UserTitleEnum;
  ciiOrganisationInfo: CiiOrganisationDto;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  
  constructor(private formBuilder: FormBuilder, private organisationService: OrganisationService,
private PatternService:PatternService,
    private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);

    this.formGroup = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required,Validators.pattern(this.PatternService.NameValidator)])],
      lastName: ['', Validators.compose([Validators.required,Validators.pattern(this.PatternService.NameValidator)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.PatternService.emailPattern)])],
    });
    this.ciiOrganisationInfo = {}
  }

  ngOnInit() {
    let ciiOrganisationInfoString = localStorage.getItem('cii_organisation') || "";
    this.ciiOrganisationInfo = JSON.parse(ciiOrganisationInfoString);
    let orgreginfo = JSON.parse(sessionStorage.getItem('orgreginfo') ?? '');
    if (orgreginfo != '') {
      this.formGroup.controls['firstName'].setValue(orgreginfo.adminUserFirstName);
      this.formGroup.controls['lastName'].setValue(orgreginfo.adminUserLastName);
      this.formGroup.controls['email'].setValue(orgreginfo.adminEmail);
    }
  }


  validateEmailLength(data:any){
    if(this.PatternService.emailValidator(data.target.value)){
        this.formGroup.controls['email'].setErrors({ 'incorrect': true})
      }
}

  public onSubmit(form: FormGroup) {
    this.submitted = true;
    if(this.PatternService.emailValidator(form.get('email')?.value)){
      this.formGroup.controls['email'].setErrors({ 'incorrect': true})
}
    if (this.formValid(form)) {
      const regType = localStorage.getItem("manage-org_reg_type") || "";
      let organisationRegisterDto: OrganisationRegisterDto = {
        ciiDetails: this.ciiOrganisationInfo,
        businessType: localStorage.getItem("manage-org_buyer_type") || "",
        rightToBuy: false,
        supplierBuyerType: regType == 'buyer' ? 1 : regType == 'both' ? 2 : 0,
        adminUserName: form.get('email')?.value,
        adminUserFirstName: form.get('firstName')?.value,
        adminUserLastName: form.get('lastName')?.value,
        adminUserTitle: "",
      };
      this.organisationService.registerOrganisation(organisationRegisterDto)
        .subscribe({
          next: () => {
            localStorage.setItem('brickendon_org_reg_email_address', organisationRegisterDto.adminUserName);
            this.router.navigateByUrl(`manage-org/register/confirm`);
          },
          error: (err: any) => {
            if (err.status == 404) {
              this.router.navigateByUrl(`manage-org/register/error/notfound`);
            } else if (err.status == 409) {
              this.router.navigateByUrl(`manage-org/register/error/reg-id-exists`);
            } else if (err.status == 400) {
              if (err.error == "ERROR_USER_ALREADY_EXISTS") {
                this.router.navigateByUrl(`manage-org/register/error/username`);
              }
              else {
                this.router.navigateByUrl(`manage-org/register/error/generic`);
              }
            } else {
              this.router.navigateByUrl(`manage-org/register/error/generic`);
            }
          }
        });
    }
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  public customFocum(): void {
    if (
      this.formGroup.controls['firstName'].invalid &&
      this.formGroup.controls['lastName'].invalid
    ) {
      this.inputs.toArray()[0].nativeElement.focus();
    } else if (this.formGroup.controls['firstName'].invalid) {
      this.inputs.toArray()[0].nativeElement.focus();
    } else if (this.formGroup.controls['lastName'].invalid) {
      this.inputs.toArray()[1].nativeElement.focus();
    }
  }

  /**
    * iterate through each form control and validate
    */
  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  goBack() {
    window.history.back();
  }

  public onClickNominate(){
    this.router.navigateByUrl(`/nominate?data=` + btoa(JSON.stringify(0)));
  }

}
