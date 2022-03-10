import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { AssignedContactType, OperationEnum } from 'src/app/constants/enum';
import { ContactPoint, OrganisationContactInfo, SiteContactInfo, VirtualContactType } from 'src/app/models/contactInfo';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ContactReason } from 'src/app/models/contactDetail';
import { WrapperOrganisationContactService } from 'src/app/services/wrapper/wrapper-org-contact-service';
import { WrapperSiteContactService } from 'src/app/services/wrapper/wrapper-site-contact-service';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { WrapperContactService } from 'src/app/services/wrapper/wrapper-contact.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Title } from '@angular/platform-browser';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';
import { PatternService } from 'src/app/shared/pattern.service';

@Component({
    selector: 'app-manage-organisation-contact-edit',
    templateUrl: './manage-organisation-contact-edit.component.html',
    styleUrls: ['./manage-organisation-contact-edit.component.scss']
})
export class ManageOrganisationContactEditComponent extends FormBaseComponent implements OnInit {

    organisationId: string = '';
    contactData: ContactPoint;
    submitted!: boolean;
    contactReasonLabel: string = "CONTACT_REASON";
    default: string = '';
    contactReasons: ContactReason[] = [];
    isEdit: boolean = false;
    isAssignedContact: boolean = false;
    contactId: number = 0;
    siteId: number = 0;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

    @ViewChildren('input') inputs!: QueryList<ElementRef>;

    constructor(private contactService: WrapperOrganisationContactService,
        private PatternService:PatternService,
         private formBuilder: FormBuilder, private router: Router,
        private activatedRoute: ActivatedRoute, protected uiStore: Store<UIState>, private titleService: Title,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private contactHelper: ContactHelper,
        private externalContactService: WrapperContactService, private siteContactService: WrapperSiteContactService) {
        super(viewportScroller, formBuilder.group({
            name: ['', Validators.compose([])],
            email: ['', Validators.compose([Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            phone: ['', Validators.compose([])],
            fax: ['', Validators.compose([])],
            mobile: ['', Validators.compose([])],
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
            this.contactId = routeData['contactId'];
            this.siteId = routeData['siteId'] || 0;
        }
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.formGroup.setValidators(this.validateForSufficientDetails());
        this.formGroup.controls['contactReason'].setValue(this.default, { onlySelf: true });
    }

    ngOnInit() {
        this.titleService.setTitle(`${this.isEdit ? 'Edit' : 'Add'} ${this.siteId == 0 ? '- Organisation Contact' : '- Site Contact'} - CCS`);
        this.externalContactService.getContactReasons().subscribe({
            next: (contactReasons: ContactReason[]) => {
                if (contactReasons != null) {
                    this.contactReasons = contactReasons;
                    if (this.isEdit) {
                        if (this.siteId == 0) {
                            this.getOrganisationContact();
                        }
                        else {
                            this.getSiteContact();
                        }
                    }
                    else{
                        this.onFormValueChange();
                    }
                }
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    getOrganisationContact() {
        this.contactService.getOrganisationContactById(this.organisationId, this.contactId).subscribe({
            next: (contactInfo: OrganisationContactInfo) => {
                this.isAssignedContact = contactInfo.assignedContactType != AssignedContactType.None;
                this.formGroup.controls['name'].setValue(contactInfo.contactPointName);
                this.formGroup.controls['email'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.EMAIL, contactInfo.contacts));
                this.formGroup.controls['phone'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.PHONE, contactInfo.contacts, true));
                this.formGroup.controls['mobile'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.MOBILE, contactInfo.contacts, true));
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



    getSiteContact() {
        this.siteContactService.getSiteContactById(this.organisationId, this.siteId, this.contactId).subscribe({
            next: (contactInfo: SiteContactInfo) => {
                this.isAssignedContact = contactInfo.assignedContactType != AssignedContactType.None;
                this.formGroup.controls['name'].setValue(contactInfo.contactPointName);
                this.formGroup.controls['email'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.EMAIL, contactInfo.contacts));
                this.formGroup.controls['phone'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.PHONE, contactInfo.contacts, true));
                this.formGroup.controls['mobile'].setValue(this.contactHelper.getContactValueFromContactList(VirtualContactType.MOBILE, contactInfo.contacts, true));
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

            return !name && !email && !phone && !mobile && !fax && !web ? { inSufficient: true } : null;
        }
    }

    public onSubmit(form: FormGroup) {
        this.submitted = true;
        if(this.PatternService.emailValidator(form.get('email')?.value)){
            this.formGroup.controls['email'].setErrors({ 'incorrect': true})
           }
        if (this.formValid(form)) {
            this.contactData.contactPointName = form.get('name')?.value;
            this.contactData.contactPointReason = form.get('contactReason')?.value;
            this.contactData.contacts = this.contactHelper.getContactListFromForm(form);

            if (this.siteId == 0) { // If organisation contact
                if (this.isEdit) {
                    this.updateOrgContact(form);
                }
                else {
                    this.createOrgContact(form);
                }
            }
            else { // If site contact
                if (this.isEdit) {
                    this.updateSiteContact(form);
                }
                else {
                    this.createSiteContact(form);
                }
            }
        }
        else {
            this.scrollHelper.scrollToFirst('error-summary');
        }
    }

    updateOrgContact(form: FormGroup) {
        this.contactService.updateOrganisationContact(this.organisationId, this.contactId, this.contactData)
            .subscribe({
                next: () => {
                    this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.UpdateOrgContact}`);
                    this.submitted = false;
                },
                error: (error) => {
                    console.log(error);
                    this.setError(form, error.error);
                }
            });
    }

    createOrgContact(form: FormGroup) {
        this.contactService.createOrganisationContact(this.organisationId, this.contactData)
            .subscribe({
                next: () => {
                    this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.CreateOrgContact}`);
                    this.submitted = false;
                },
                error: (error) => {
                    console.log(error);
                    this.setError(form, error.error);
                }
            });
    }

    updateSiteContact(form: FormGroup) {
        this.siteContactService.updateSiteContact(this.organisationId, this.siteId, this.contactId, this.contactData)
            .subscribe({
                next: () => {
                    let data = {
                        'siteId': this.siteId
                    };
                    this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.UpdateSiteContact}?data=` + JSON.stringify(data));
                    this.submitted = false;
                },
                error: (error) => {
                    console.log(error);
                    this.setError(form, error.error);
                }
            });
    }

    createSiteContact(form: FormGroup) {
        this.siteContactService.createSiteContact(this.organisationId, this.siteId, this.contactData)
            .subscribe({
                next: () => {
                    let data = {
                        'siteId': this.siteId
                    };
                    this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.CreateSiteContact}?data=` + JSON.stringify(data));
                    this.submitted = false;
                },
                error: (error) => {
                    console.log(error);
                    this.setError(form, error.error);
                }
            });
    }

    setError(form: FormGroup, errorCode: string) {
        let errorString: string = '';
        let control: string = '';
        if (errorCode == "INVALID_PHONE_NUMBER") {
            control = 'phone';
            errorString = 'invalid';
        }
        else if (errorCode == "INVALID_EMAIL") {
            control = 'email';
            errorString = 'email';
        }
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
        if (this.siteId == 0) {
            this.router.navigateByUrl('manage-org/profile');
        }
        else {
            let data = {
                'isEdit': true,
                'siteId': this.siteId
            };
            this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
        }
    }

    onDeleteClick() {
        let data = {
            'organisationId': this.organisationId,
            'contactId': this.contactId,
            'siteId': this.siteId
        };
        this.router.navigateByUrl(`manage-org/profile/${this.siteId == 0 ? '' : 'site/'}contact-delete?data=` + JSON.stringify(data));
    }

    onUnassignClick() {
        let data = {
            'unassignOrgId': this.organisationId,
            'unassignSiteId': this.siteId,
            'contactId': this.contactId
        };
        this.router.navigateByUrl('contact-unassign/confirm?data=' + JSON.stringify(data));
    }
}
