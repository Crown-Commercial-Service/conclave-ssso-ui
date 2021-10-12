import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location, ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { ContactPoint, UserContactInfo, VirtualContactType } from 'src/app/models/contactInfo';
import { WrapperUserContactService } from 'src/app/services/wrapper/wrapper-user-contact.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ContactReason } from 'src/app/models/contactDetail';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { WrapperContactService } from 'src/app/services/wrapper/wrapper-contact.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Title } from '@angular/platform-browser';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';

@Component({
    selector: 'app-user-contact-edit',
    templateUrl: './user-contact-edit.component.html',
    styleUrls: ['./user-contact-edit.component.scss']
})
export class UserContactEditComponent extends FormBaseComponent implements OnInit {

    userName: string = '';
    contactData: ContactPoint;
    submitted!: boolean;
    contactReasonLabel: string = "CONTACT_REASON";
    default: string = '';
    contactReasons: ContactReason[] = [];
    isEdit: boolean = false;
    contactId: number = 0;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

    @ViewChildren('input') inputs!: QueryList<ElementRef>;

    constructor(private contactService: WrapperUserContactService, private formBuilder: FormBuilder, private router: Router,
        private activatedRoute: ActivatedRoute, protected uiStore: Store<UIState>, private contactHelper: ContactHelper,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private externalContactService: WrapperContactService,
        private titleService: Title) {
        super(viewportScroller, formBuilder.group({
            name: ['', Validators.compose([])],
            email: ['', Validators.compose([Validators.email])],
            phone: ['', Validators.compose([])],
            fax: ['', Validators.compose([])],
            webUrl: ['', Validators.compose([])],
            contactReason: ['', Validators.compose([])],
        }));
        this.contactData = {
            contacts: []
        };
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.isEdit = routeData['isEdit'];
            this.userName = routeData['userName'];
            this.contactId = routeData['contactId'];
        }
        this.formGroup.setValidators(this.validateForSufficientDetails());
        this.formGroup.controls['contactReason'].setValue(this.default, { onlySelf: true });
    }

    ngOnInit() {
        this.titleService.setTitle(`${this.isEdit ? 'Edit' : 'Add'} - User Contact - CCS`);
        this.externalContactService.getContactReasons().subscribe({
            next: (contactReasons: ContactReason[]) => {
                if (contactReasons != null) {
                    this.contactReasons = contactReasons;
                    if (this.isEdit) {
                        this.contactService.getUserContactById(this.userName, this.contactId).subscribe({
                            next: (contactInfo: UserContactInfo) => {
                                this.formGroup.controls['name'].setValue(contactInfo.contactPointName);
                                this.formGroup.controls['email'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.EMAIL, contactInfo.contacts));
                                this.formGroup.controls['phone'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.PHONE, contactInfo.contacts, true));
                                this.formGroup.controls['fax'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.FAX, contactInfo.contacts, true));
                                this.formGroup.controls['webUrl'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.URL, contactInfo.contacts));
                                this.formGroup.controls['contactReason'].setValue(contactInfo.contactPointReason);
                                this.onFormValueChange();
                            },
                            error: (error: any) => {
                                console.log(error);
                            }
                        });
                    }
                    else {
                        this.onFormValueChange();
                    }
                }
            },
            error: (error: any) => {
                console.log(error);
            }
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
            let fax = this.formGroup.get('fax')?.value;
            let web = this.formGroup.get('webUrl')?.value;

            return !name && !email && !phone && !fax && !web ? { inSufficient: true } : null;
        }
    }

    public onSubmit(form: FormGroup) {
        this.submitted = true;
        if (this.formValid(form)) {

            this.contactData.contactPointName = form.get('name')?.value;
            this.contactData.contacts = this.contactHelper.getContactListFromForm(form);
            this.contactData.contactPointReason = form.get('contactReason')?.value;

            if (this.isEdit) {
                this.contactService.updateUserContact(this.userName, this.contactId, this.contactData)
                    .subscribe({
                        next: () => {
                            this.router.navigateByUrl(`operation-success/${OperationEnum.MyAccountContactUpdate}`);
                            this.submitted = false;
                        },
                        error: (error) => {
                            console.log(error);
                            console.log(error.error);
                            if (error.error == "INVALID_PHONE_NUMBER") {
                                this.setError(form, 'phone', 'invalid');
                            }
                            else if (error.error == "INVALID_EMAIL") {
                                this.setError(form, 'email', 'email');
                            }
                        }
                    });
            }
            else {
                this.contactService.createUserContact(this.userName, this.contactData)
                    .subscribe({
                        next: () => {
                            this.router.navigateByUrl(`operation-success/${OperationEnum.MyAccountContactCreate}`);
                            this.submitted = false;
                        },
                        error: (error) => {
                            console.log(error);
                            console.log(error.error);
                            if (error.error == "INVALID_PHONE_NUMBER") {
                                this.setError(form, 'phone', 'invalid')
                            }
                            else if (error.error == "INVALID_EMAIL") {
                                this.setError(form, 'email', 'email');
                            }
                        }
                    });
            }
        }
        else {
            this.scrollHelper.scrollToFirst('error-summary');
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
    }

    onDeleteClick() {
        console.log("Delete");
        let data = {
            'userName': encodeURIComponent(this.userName),
            'contactId': this.contactId
        };
        this.router.navigateByUrl('user-contact-delete?data=' + JSON.stringify(data));
    }
}
