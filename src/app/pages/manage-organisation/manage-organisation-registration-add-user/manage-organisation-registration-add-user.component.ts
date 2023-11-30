import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { CiiOrganisationDto, OrganisationRegBasicInfo, OrganisationRegisterDto } from 'src/app/models/organisation';
import { UserTitleEnum } from 'src/app/constants/enum';
import { PatternService } from 'src/app/shared/pattern.service';
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

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
  public pageAccessMode: any;
  public buyerFlow: any;
  legalName: string = '';
  public isCustomMfaEnabled=environment.appSetting.customMfaEnabled;

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder, private organisationService: OrganisationService,
    private PatternService: PatternService,private sessionService:SessionService,
    private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private ActivatedRoute: ActivatedRoute, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);

    this.formGroup = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(this.PatternService.NameValidator)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(this.PatternService.NameValidator)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.PatternService.emailPattern)])],
    });
    this.ciiOrganisationInfo = {}
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      if (para.data != undefined) {
        this.pageAccessMode = JSON.parse(atob(para.data));
      } else {
        this.pageAccessMode = null
      }
    });
    this.buyerFlow = localStorage.getItem('organisation_type') ?? '';

  }

  ngOnInit() {
    this.ciiOrganisationInfo = localStorage.getItem('cii_organisation') ? JSON.parse(localStorage.getItem('cii_organisation')!) : {};
    let orgreginfo = sessionStorage.getItem('orgreginfo') ? JSON.parse(sessionStorage.getItem('orgreginfo')!) : null;
    if (orgreginfo) {
      this.formGroup.controls['firstName'].setValue(orgreginfo.adminUserFirstName);
      this.formGroup.controls['lastName'].setValue(orgreginfo.adminUserLastName);
      this.formGroup.controls['email'].setValue(orgreginfo.adminEmail);
      this.pushDataLayer("form_start");
    }
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: this.sessionService.decrypt('user_name'),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
     });
    })
  }


  validateEmailLength(data: any) {
    if (this.PatternService.emailValidator(data.target.value)) {
      this.formGroup.controls['email'].setErrors({ 'incorrect': true })
    }
  }

  public onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.PatternService.emailValidator(form.get('email')?.value)) {
      this.formGroup.controls['email'].setErrors({ 'incorrect': true })
    }
    if (this.formValid(form)) {
      const regType = localStorage.getItem("manage-org_reg_type") || "";
      let orgreginfo = JSON.parse(sessionStorage.getItem('orgreginfo') ?? '');
      let organisationRegisterDto: OrganisationRegisterDto = {
        ciiDetails: this.ciiOrganisationInfo,
        businessType: localStorage.getItem("manage-org_buyer_type") || "",
        rightToBuy: false,
        supplierBuyerType: regType == 'buyer' ? 1 : regType == 'both' ? 2 : 0,
        adminUserName: form.get('email')?.value,
        adminUserFirstName: form.get('firstName')?.value,
        adminUserLastName: form.get('lastName')?.value,
        adminUserTitle: "",
        isMfaRequired:orgreginfo.isMfaRequired
      };

      this.pushDataLayer("form_submit");

      let updatedOrgRegInfo: OrganisationRegBasicInfo = {
        adminEmail: form.get('email')?.value,
        adminUserFirstName: form.get('firstName')?.value,
        adminUserLastName: form.get('lastName')?.value,
        orgName: '',
        ciiOrgId: '',
        isMfaRequired:false
    };
    sessionStorage.setItem('orgreginfo', JSON.stringify(updatedOrgRegInfo));

      this.organisationService.registerOrganisation(organisationRegisterDto)
        .subscribe({
          next: () => {
            localStorage.setItem('brickendon_org_reg_email_address', organisationRegisterDto.adminUserName);
            this.router.navigateByUrl(`/manage-org/register/confirm?data=` + btoa(JSON.stringify(this.pageAccessMode)));
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
    } else {
      this.pushDataLayer("form_error");
    }
    this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "Admin Details - Registration"
		});
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

  public goConfirmOrgPage(): void {
    const schemeDetails = JSON.parse(localStorage.getItem('schemeDetails') || '');
    this.router.navigateByUrl(
      `manage-org/register/search/${schemeDetails.scheme}?id=${encodeURIComponent(
        schemeDetails.schemeID
      )}`
    );
  }

  public onClickNominate() {
    this.router.navigateByUrl(`/nominate?data=` + btoa(JSON.stringify(0)));
  }

  public goBack() {
    window.history.back()
  }

  pushDataLayer(event:string){
    this.dataLayerService.pushEvent({
        'event': event,
        'form_id': 'Additional_registries Create_administrator_account'
    });
  }
}
