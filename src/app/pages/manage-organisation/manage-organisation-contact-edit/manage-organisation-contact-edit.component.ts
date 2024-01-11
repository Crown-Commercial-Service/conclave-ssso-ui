import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { AssignedContactType, OperationEnum } from 'src/app/constants/enum';
import {
  ContactPoint,
  OrganisationContactInfo,
  SiteContactInfo,
  VirtualContactType,
} from 'src/app/models/contactInfo';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ContactReason } from 'src/app/models/contactDetail';
import { WrapperOrganisationContactService } from 'src/app/services/wrapper/wrapper-org-contact-service';
import { WrapperSiteContactService } from 'src/app/services/wrapper/wrapper-site-contact-service';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { WrapperContactService } from 'src/app/services/wrapper/wrapper-contact.service';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { Title } from '@angular/platform-browser';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';
import { PatternService } from 'src/app/shared/pattern.service';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { OrganisationSiteResponse } from 'src/app/models/site';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-manage-organisation-contact-edit',
  templateUrl: './manage-organisation-contact-edit.component.html',
  styleUrls: ['./manage-organisation-contact-edit.component.scss'],
})
export class ManageOrganisationContactEditComponent
  extends FormBaseComponent
  implements OnInit
{
  organisationId: string = '';
  contactData: ContactPoint;
  submitted!: boolean;
  contactReasonLabel: string = 'CONTACT_REASON';
  default: string = '';
  contactReasons: ContactReason[] = [];
  isEdit: boolean = false;
  contactAddAnother :boolean = false;
  isAssignedContact: boolean = false;
  contactId: number = 0;
  siteId: number = 0;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  public contact_error: boolean = false;
  public formId : string = 'Manage_your_organisation Edit_contact_details';
  public toggleInput: any = [
    {
      data: 'email',
      status: false,
      isChecked: false,
      formControlName: 'email',
    },
    {
      data: 'Telephone',
      status: false,
      isChecked: false,
      formControlName: 'phone',
    },
    {
      data: 'Mobile',
      status: false,
      isChecked: false,
      formControlName: 'mobile',
    },
    { data: 'Fax', status: false, isChecked: false, formControlName: 'fax' },
    { data: 'Web', status: false, isChecked: false, formControlName: 'webUrl' },
  ];
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  siteCreate: any;
  siteInfo: any = {};
  ContactAdd: any;

  constructor(
    private contactService: WrapperOrganisationContactService,
    private PatternService: PatternService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected uiStore: Store<UIState>,
    private titleService: Title,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private contactHelper: ContactHelper,
    private externalContactService: WrapperContactService,
    private siteContactService: WrapperSiteContactService,
    private orgSiteService: WrapperOrganisationSiteService,
    private dataLayerService: DataLayerService
  ) {
    super(
      viewportScroller,
      formBuilder.group({
        name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[ A-Za-z0-9&().,'/&-]*$/),
            Validators.maxLength(256),
            Validators.minLength(3),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.pattern(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ]),
        ],
        phone: ['', Validators.compose([])],
        fax: ['', Validators.compose([])],
        mobile: ['', Validators.compose([])],
        webUrl: [
          '',
          Validators.compose([
            Validators.pattern(
              /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            ),
          ]),
        ],
        contactReason: ['', Validators.compose([])],
      })
    );
    this.contactData = {
      contacts: [],
    };
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.data) {
      let routeData = JSON.parse(queryParams.data);
      this.isEdit = routeData['isEdit'];
      this.contactId = routeData['contactId'];
      this.siteId = routeData['siteId'] || 0;
      this.siteCreate = routeData['siteCreate'] || false;
      this.ContactAdd = routeData['ContactAdd'] || false;
      this.contactAddAnother = routeData['contactAddAnother'] ; 
    }
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.formGroup.setValidators(this.validateForSufficientDetails());
    this.formGroup.controls['contactReason'].setValue(this.default, {
      onlySelf: true,
    });
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
    if (this.siteCreate) {
      this.getSiteDetails();
    }
    this.titleService.setTitle(
      `${this.isEdit ? 'Edit' : 'Add'} ${
        this.siteId == 0 ? '- Organisation Contact' : '- Site Contact'
      } - CCS`
    );
    this.externalContactService.getContactReasons().subscribe({
      next: (contactReasons: ContactReason[]) => {
        if (contactReasons != null) {
          this.contactReasons = contactReasons;
          if (this.isEdit) {
            if (this.siteId == 0) {
              this.getOrganisationContact();
            } else {
              this.getSiteContact();
            }
          } else {
            this.onFormValueChange();
          }
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
    this.dataLayerService.pushFormStartEvent(this.formId, this.formGroup);
  }

  getOrganisationContact() {
    this.contactService
      .getOrganisationContactById(this.organisationId, this.contactId)
      .subscribe({
        next: (contactInfo: OrganisationContactInfo) => {
          this.isAssignedContact =
            contactInfo.assignedContactType != AssignedContactType.None;
          this.formGroup.controls['name'].setValue(
            contactInfo.contactPointName
          );
          this.formGroup.controls['email'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.EMAIL,
              contactInfo.contacts
            )
          );
          this.formGroup.controls['phone'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.PHONE,
              contactInfo.contacts,
              true
            )
          );
          this.formGroup.controls['mobile'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.MOBILE,
              contactInfo.contacts,
              true
            )
          );
          this.formGroup.controls['fax'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.FAX,
              contactInfo.contacts,
              true
            )
          );
          this.formGroup.controls['webUrl'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.URL,
              contactInfo.contacts
            )
          );
          this.formGroup.controls['contactReason'].setValue(
            contactInfo.contactPointReason
          );
          this.onFormValueChange();
          this.EditCheckbox();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  getSiteContact() {
    this.siteContactService
      .getSiteContactById(this.organisationId, this.siteId, this.contactId)
      .subscribe({
        next: (contactInfo: SiteContactInfo) => {
          this.isAssignedContact =
            contactInfo.assignedContactType != AssignedContactType.None;
          this.formGroup.controls['name'].setValue(
            contactInfo.contactPointName
          );
          this.formGroup.controls['email'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.EMAIL,
              contactInfo.contacts
            )
          );
          this.formGroup.controls['phone'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.PHONE,
              contactInfo.contacts,
              true
            )
          );
          this.formGroup.controls['mobile'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.MOBILE,
              contactInfo.contacts,
              true
            )
          );
          this.formGroup.controls['fax'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.FAX,
              contactInfo.contacts,
              true
            )
          );
          this.formGroup.controls['webUrl'].setValue(
            this.contactHelper.getContactValueFromContactList(
              VirtualContactType.URL,
              contactInfo.contacts
            )
          );
          this.formGroup.controls['contactReason'].setValue(
            contactInfo.contactPointReason
          );
          this.onFormValueChange();
          this.EditCheckbox();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  scrollToAnchor(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  setFocusForIntlTelComponent(id: string) {
    let inputElementIntlTel = document.getElementById(id);
    inputElementIntlTel?.focus();
  }

  validateForSufficientDetails(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let name = this.formGroup.get('name')?.value;
      let email = this.formGroup.get('email')?.value;
      let phone = this.formGroup.get('phone')?.value;
      let mobile = this.formGroup.get('mobile')?.value;
      let fax = this.formGroup.get('fax')?.value;
      let web = this.formGroup.get('webUrl')?.value;

      return !name && !email && !phone && !mobile && !fax && !web
        ? { inSufficient: true }
        : null;
    };
  }

  validateEmailLength(data: any) {
    if (this.PatternService.emailValidator(data.target.value)) {
      this.formGroup.controls['email'].setErrors({ incorrect: true });
    }
  }

  public onSubmit(form: FormGroup) {
    this.submitted = true;
    this.whiteSpaceValidator
    if (this.PatternService.emailValidator(form.get('email')?.value)) {
      this.formGroup.controls['email'].setErrors({ incorrect: true });
    }
    if (this.formValid(form)) {
      if (!this.validator) {
        this.contactData.contactPointName = form.get('name')?.value;
        this.contactData.contactPointReason = form.get('contactReason')?.value;
        this.contactData.contacts =
          this.contactHelper.getContactListFromForm(form);

          this.dataLayerService.pushFormSubmitEvent(this.formId);

        if (this.siteId == 0) {
          // If organisation contact
          if (this.isEdit) {
            this.updateOrgContact(form);
          } else {
            this.createOrgContact(form);
          }
        } else {
          // If site contact
          if (this.isEdit) {
            this.updateSiteContact(form);
          } else {
            this.createSiteContact(form);
          }
        }
      } else {
        this.scrollHelper.scrollToFirst('error-summary-title');
        this.dataLayerService.pushFormErrorEvent(this.formId);
      }
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
      this.dataLayerService.pushFormErrorEvent(this.formId);
    }
  }

  updateOrgContact(form: FormGroup) {
    this.contactService
      .updateOrganisationContact(
        this.organisationId,
        this.contactId,
        this.contactData
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl(
            `manage-org/profile/contact-operation-success/${OperationEnum.UpdateOrgContact}`
          );
          this.submitted = false;
        },
        error: (error) => {
          console.log(error);
          this.setError(form, error.error);
        },
      });
  }

  createOrgContact(form: FormGroup) {
    this.contactService
      .createOrganisationContact(this.organisationId, this.contactData)
      .subscribe({
        next: () => {
          this.router.navigateByUrl(
            `manage-org/profile/contact-operation-success/${OperationEnum.CreateOrgContact}`
          );
          this.submitted = false;
        },
        error: (error) => {
          console.log(error);
          this.setError(form, error.error);
        },
      });
  }

  updateSiteContact(form: FormGroup) {
    this.siteContactService
      .updateSiteContact(
        this.organisationId,
        this.siteId,
        this.contactId,
        this.contactData
      )
      .subscribe({
        next: () => {
          let data = {
            siteId: this.siteId,
          };
          this.router.navigateByUrl(
            `manage-org/profile/contact-operation-success/${OperationEnum.UpdateSiteContact}?data=` +
              JSON.stringify(data)
          );
          this.submitted = false;
        },
        error: (error) => {
          console.log(error);
          this.setError(form, error.error);
        },
      });
  }

  createSiteContact(form: FormGroup) {
    this.siteContactService
      .createSiteContact(this.organisationId, this.siteId, this.contactData)
      .subscribe({
        next: () => {
          let data = {
            siteId: this.siteId,
            siteCreate: this.siteCreate,
          };
          this.router.navigateByUrl(
            `manage-org/profile/contact-operation-success/${OperationEnum.CreateSiteContact}?data=` +
              JSON.stringify(data)
          );
          this.submitted = false;
        },
        error: (error) => {
          console.log(error);
          this.setError(form, error.error);
        },
      });
  }

  setError(form: FormGroup, errorCode: string) {
    let errorString: string = '';
    let control: string = '';
    if (errorCode == 'INVALID_PHONE_NUMBER') {
      control = 'phone';
      errorString = 'invalid';
    } else if (errorCode == 'INVALID_EMAIL') {
      control = 'email';
      errorString = 'email';
    } else if (errorCode == 'INVALID_MOBILE_NUMBER') {
      control = 'mobile';
      errorString = 'mobile';
    } else if (errorCode == 'INVALID_FAX_NUMBER') {
      control = 'fax';
      errorString = 'fax';
    }
    var errorObject: ValidationErrors = {};
    errorObject[errorString] = true;
    form.controls[control].setErrors(errorObject);
    this.scrollHelper.scrollToFirst('error-summary');
    this.dataLayerService.pushFormErrorEvent(this.formId);
  }

  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelClick(click: string) {
    if (click === 'edit') {
      let data = {
        isEdit: true,
        siteId: this.siteId,
      };
      this.router.navigateByUrl(
        'manage-org/profile/site/edit?data=' + JSON.stringify(data)
      );
    } else {
      window.history.back();
      this.pushDataLayerEvent(click);
    }
    // if (this.siteId == 0) {
    //   this.router.navigateByUrl('manage-org/profile');
    // } else {
    //   let data = {
    //     isEdit: true,
    //     siteId: this.siteId,
    //   };
    //   this.router.navigateByUrl(
    //     'manage-org/profile/site/edit?data=' + JSON.stringify(data)
    //   );
    // }
  }

  onDeleteClick() {
    let data = {
      organisationId: this.organisationId,
      contactId: this.contactId,
      siteId: this.siteId,
    };
    this.router.navigateByUrl(
      `manage-org/profile/${
        this.siteId == 0 ? '' : 'site/'
      }contact-delete?data=` + JSON.stringify(data)
    );
  }

  public generateDeleteClickRoute(): string {
    return `/manage-org/profile/${
      this.siteId == 0 ? '' : 'site/'
    }contact-delete`
  }

  getQueryData(): string {
    const data = {
      organisationId: this.organisationId,
      contactId: this.contactId,
      siteId: this.siteId,
    };
    return JSON.stringify(data);
  }

  onUnassignClick() {
    let data = {
      unassignOrgId: this.organisationId,
      unassignSiteId: this.siteId,
      contactId: this.contactId,
    };
    this.router.navigateByUrl(
      'contact-unassign/confirm?data=' + JSON.stringify(data)
    );
  }

  getUnassignQueryData(): string {
    let data = {
      unassignOrgId: this.organisationId,
      unassignSiteId: this.siteId,
      contactId: this.contactId,
    };
    return JSON.stringify(data);
  }

  public checkBoxClick(checkboxData: string): void {
    this.toggleInput.forEach((f: any) => {
      if (f.data === checkboxData) {
        if (f.status === false) {
          f.status = true;
          f.isChecked = true;
        } else {
          f.status = false;
          this.formGroup.controls[f.formControlName].setValue('');
        }
      }
    });
  }

  public EditCheckbox(): void {
    this.toggleInput.forEach((f: any) => {
      if (
        this.formGroup.get(f.formControlName)?.value != '' &&
        this.formGroup.get(f.formControlName)?.value != null
      ) {
        f.isChecked = true;
        f.status = true;
      }
    });
  }

  public get validator() {
    if (
      this.formGroup.get('email')?.value ||
      this.formGroup.get('phone')?.value ||
      this.formGroup.get('mobile')?.value ||
      this.formGroup.get('fax')?.value ||
      this.formGroup.get('webUrl')?.value
    ) {
      this.contact_error = false;
      return false;
    }
    this.contact_error = true;
    return true;
  }

  pushDataLayerEvent(buttonText: string) {
		this.dataLayerService.pushClickEvent(buttonText);
	  }


  private getSiteDetails(): void {
    this.orgSiteService
      .getOrganisationSite(this.organisationId, this.siteId)
      .subscribe({
        next: (siteInfo: OrganisationSiteResponse) => {
          this.siteInfo = siteInfo;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  public get whiteSpaceValidator(){
    const isWhitespace = (this.formGroup.get('name')?.value && this.formGroup.get('name')?.value && this.formGroup.get('name')?.value.toString() || '').trim().length === 0;
    if(this.submitted && isWhitespace){
      this.formGroup.controls['name'].setErrors({ required: true });
      return true
    } 
    return false
  }

  pushDataLayer(event:string){
    this.dataLayerService.pushEvent({
      'event': event,
      'form_id': 'Manage_your_organisation Edit_contact_details'
    });
  }
}
