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
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location, ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import {
  ContactPoint,
  UserContactInfo,
  VirtualContactType,
} from 'src/app/models/contactInfo';
import { WrapperUserContactService } from 'src/app/services/wrapper/wrapper-user-contact.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ContactReason } from 'src/app/models/contactDetail';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { WrapperContactService } from 'src/app/services/wrapper/wrapper-contact.service';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { Title } from '@angular/platform-browser';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';
import { SessionStorageKey } from 'src/app/constants/constant';
import { PatternService } from 'src/app/shared/pattern.service';
import { duration } from 'moment';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-user-contact-edit',
  templateUrl: './user-contact-edit.component.html',
  styleUrls: ['./user-contact-edit.component.scss'],
})
export class UserContactEditComponent
  extends FormBaseComponent
  implements OnInit
{
  userName: string = '';
  contactData: ContactPoint;
  submitted!: boolean;
  contactReasonLabel: string = 'CONTACT_REASON';
  default: string = '';
  contactReasons: ContactReason[] = [];
  isEdit: boolean = false;
  isEditContact: boolean = true;
  contactId: number = 0;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  public contact_error: boolean = false;
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
  isOrgAdmin: boolean = false;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    public contactService: WrapperUserContactService,
    private formBuilder: FormBuilder,
    public router: Router,
    private PatternService: PatternService,
    private activatedRoute: ActivatedRoute,
    protected uiStore: Store<UIState>,
    private contactHelper: ContactHelper,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    public externalContactService: WrapperContactService,
    private titleService: Title,
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
        mobile: ['', Validators.compose([])],
        fax: ['', Validators.compose([])],
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
      this.userName =
        sessionStorage.getItem(SessionStorageKey.UserContactUsername) ?? '';
      this.contactId = routeData['contactId'];
      this.isEditContact = routeData['isEditContact'];
    }
    this.formGroup.setValidators(this.validateForSufficientDetails());
    this.formGroup.controls['contactReason'].setValue(this.default, {
      onlySelf: true,
    });
    this.pushDataLayer("form_start");
  }

  ngOnInit() {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: localStorage.getItem("user_name"),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
     });
    })
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.titleService.setTitle(
      `${this.isEdit ? 'Edit' : 'Add'} - User Contact - CCS`
    );
    this.externalContactService.getContactReasons().subscribe({
      next: (contactReasons: ContactReason[]) => {
        if (contactReasons != null) {
          this.contactReasons = contactReasons;
          if (this.isEdit) {
            this.contactService
              .getUserContactById(this.userName, this.contactId)
              .subscribe({
                next: (contactInfo: UserContactInfo) => {
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
          } else {
            this.onFormValueChange();
          }
        }
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

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Add/Edit - User Contact"
    });
  }

  public onSubmit(form: FormGroup) {
    this.submitted = true;
    this.whiteSpaceValidator
    if (this.PatternService.emailValidator(form.get('email')?.value)) {
      this.formGroup.controls['email'].setErrors({ incorrect: true });
    }
    if (this.formValid(form)) {
      if (!this.validators) {
        this.contactData.contactPointName = form.get('name')?.value;
        this.contactData.contacts =
          this.contactHelper.getContactListFromForm(form);
        this.contactData.contactPointReason = form.get('contactReason')?.value;
        this.pushDataLayer("form_submit");
        if (this.isEdit) {
          this.contactService
            .updateUserContact(this.userName, this.contactId, this.contactData)
            .subscribe({
              next: () => {
                this.router.navigateByUrl(
                  `operation-success/${OperationEnum.MyAccountContactUpdate}`
                );
                this.submitted = false;
              },
              error: (error) => {
                console.log(error);
                console.log(error.error);
                if (error.error == 'INVALID_PHONE_NUMBER') {
                  this.setError(form, 'phone', 'invalid');
                } else if (error.error == 'INVALID_EMAIL') {
                  this.setError(form, 'email', 'email');
                } else if (error.error == 'INVALID_MOBILE_NUMBER') {
                  this.setError(form, 'mobile', 'invalid');
                } else if (error.error == 'INVALID_FAX_NUMBER') {
                  this.setError(form, 'fax', 'invalid');
                }
              },
            });
        } else {
          this.contactService
            .createUserContact(this.userName, this.contactData)
            .subscribe({
              next: () => {
                this.router.navigateByUrl(
                  `operation-success/${OperationEnum.MyAccountContactCreate}`
                );
                this.submitted = false;
              },
              error: (error) => {
                console.log(error);
                console.log(error.error);
                if (error.error == 'INVALID_PHONE_NUMBER') {
                  this.setError(form, 'phone', 'invalid');
                } else if (error.error == 'INVALID_EMAIL') {
                  this.setError(form, 'email', 'email');
                } else if (error.error == 'INVALID_MOBILE_NUMBER') {
                  this.setError(form, 'mobile', 'invalid');
                } else if (error.error == 'INVALID_FAX_NUMBER') {
                  this.setError(form, 'fax', 'invalid');
                }
              },
            });
        }
      } else {
        this.scrollHelper.scrollToFirst('error-summary-title');
        this.pushDataLayer("form_error");
      }
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
      this.pushDataLayer("form_error");
    }
  }

  setError(form: FormGroup, control: string, errorString: string) {
    var errorObject: ValidationErrors = {};
    errorObject[errorString] = true;
    form.controls[control].setErrors(errorObject);
    this.scrollHelper.scrollToFirst('error-summary');
  }

  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelClick() {
    this.router.navigateByUrl('profile');
    this.pushDataLayerEvent();
  }

  onDeleteClick() {
    console.log('Delete');
    let data = {
      contactId: this.contactId,
    };
    this.router.navigateByUrl(
      'user-contact-delete?data=' + JSON.stringify(data)
    );
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

  public get validators() {
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
        'form_id': 'Manage_my_account Edit_contact_details'
    });
  }

  // public get checkboxValidator() {
  //   let returnValue=false
  //   this.toggleInput.forEach((f: any) => {
  //     if (f.isChecked) {
  //       if (this.formGroup.get(f.formControlName)?.value) {
  //         return false
  //       } else {
  //         returnValue=true
  //         this.formGroup.controls[f.formControlName].setErrors({
  //         incorrect: true,
  //         });
  //         return true;
  //       }
  //     }
  //     return false;
  //   });
  //   return returnValue;
  // }
}
