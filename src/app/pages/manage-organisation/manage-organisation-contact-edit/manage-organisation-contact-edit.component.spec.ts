import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageOrganisationContactEditComponent } from './manage-organisation-contact-edit.component';
import { CountryISO } from 'ngx-intl-tel-input';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

describe('ManageOrganisationContactEditComponent', () => {
  let component: ManageOrganisationContactEditComponent;
  let fixture: ComponentFixture<ManageOrganisationContactEditComponent>;
  let localStore: any = {
    cii_organisation_id: 'test-org-id',
  };
  let router: Router;

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationContactEditComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: Store, useFactory: () => ({}) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationContactEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component correctly', () => {
    expect(component.organisationId).toBe('test-org-id');
    expect(component.submitted).toBeFalsy();
    expect(component.contactReasonLabel).toBe('CONTACT_REASON');
    expect(component.default).toBe('');
    expect(component.contactReasons).toEqual([]);
    expect(component.isEdit).toBeFalsy();
    expect(component.isAssignedContact).toBeFalsy();
    expect(component.contactId).toBe(0);
    expect(component.siteId).toBe(0);
    expect(component.separateDialCode).toBeFalsy();
    expect(component.SearchCountryField).toBeDefined();
    expect(component.CountryISO).toBeDefined();
    expect(component.PhoneNumberFormat).toBeDefined();
    expect(component.preferredCountries).toEqual([
      CountryISO.UnitedStates,
      CountryISO.UnitedKingdom,
    ]);
    expect(component.contact_error).toBeTruthy();
    expect(component.toggleInput).toEqual([
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
      {
        data: 'Web',
        status: false,
        isChecked: false,
        formControlName: 'webUrl',
      },
    ]);
  });

  it('should display the breadcrumb navigation correctly based on the component state', () => {
    component.siteId = 123;
    fixture.detectChanges();
    const breadcrumbLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbLinks.length).toBe(4);
    expect(breadcrumbLinks[2].textContent.trim()).toBe('EDIT_SITE');

    component.isEdit = true;    
    fixture.detectChanges();
    expect(breadcrumbLinks[3].textContent.trim()).toBe('ADD_NEW_CONTACT');

    component.siteCreate = true;
    fixture.detectChanges();
    expect(breadcrumbLinks[3].textContent.trim()).toBe('ADD_NEW_CONTACT');

    component.ContactAdd = true;
    fixture.detectChanges();
    expect(breadcrumbLinks[3].textContent.trim()).toBe('ADD_NEW_CONTACT');
  });

  it('should render the form correctly with the appropriate form controls and labels', () => {
    const formControls = fixture.nativeElement.querySelectorAll(
      '.govuk-form-group input, .govuk-form-group select'
    );
    const formLabels = fixture.nativeElement.querySelectorAll(
      '.govuk-form-group label'
    );
    expect(formControls.length).toBe(2);
    expect(formLabels.length).toBe(2);

    expect(formLabels[0].textContent.trim()).toBe('CONTACT_REASON_FORM');
    expect(formLabels[1].textContent.trim()).toBe('CONTACT_NAME');
  });

  it('should validate the form correctly for each form control', () => {
    const nameInput = fixture.nativeElement.querySelector('#name');
    nameInput.value = '';
    nameInput.dispatchEvent(new Event('input'));
    component.submitted = true;
    fixture.detectChanges();
    const nameError = fixture.nativeElement.querySelector('#name-error');
    expect(nameError.textContent.trim()).toBe(
      'ERROR_PREFIXEnter a contact name'
    );
  });

  it('should display the error summary section correctly when form validation fails', () => {
    component.submitted = true;
    component.formGroup.controls['name'].setValue('');
    fixture.detectChanges();

    const errorSummary = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    expect(errorSummary).toBeTruthy();
  });

  it('should call the onSubmit method when the form is submitted and the form is valid', () => {
    spyOn(component, 'onSubmit');
    component.formGroup.controls['name'].setValue('John Doe');
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call the onCancelClick method when the cancel button is clicked', () => {
    spyOn(component, 'onCancelClick');
    const cancelButton = fixture.nativeElement.querySelector(
      '.govuk-button--secondary'
    );
    cancelButton.click();
    expect(component.onCancelClick).toHaveBeenCalledWith('Cancel');
  });

  it('should call the onDeleteClick method when the delete link is clicked', () => {
    spyOn(component, 'generateDeleteClickRoute');
    component.isEdit = true;
    component.isAssignedContact = false;
    fixture.detectChanges();
    const deleteLink = fixture.nativeElement.querySelector('.delete-link');
    console.log(deleteLink);
    deleteLink.click();
    expect(component.generateDeleteClickRoute).toHaveBeenCalled();
  });

  it('should call the onUnassignClick method when the unassign link is clicked', () => {    
    spyOn(router, 'navigateByUrl');
    component.isEdit = true;
    component.isAssignedContact = true;
    component.siteId = 0;
    fixture.detectChanges();
    const unassignLink = fixture.nativeElement.querySelector('.delete-link');   
    unassignLink.click();    
    expect(router.navigateByUrl).toHaveBeenCalled();        
  });

  it('should call the createOrgContact method correctly when creating a new organization contact', () => {
    spyOn(component, 'createOrgContact');
    component.isEdit = false;
    component.siteId = 0;
    component.submitted = true;
    component.formGroup.controls['name'].setValue('Test user');
    component.formGroup.controls['email'].setValue('test@example.com');
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.createOrgContact).toHaveBeenCalled();
  });

  it('should call the updateOrgContact method correctly when updating an existing organization contact', () => {
    spyOn(component, 'updateOrgContact');
    component.submitted = true;
    component.isEdit = true;
    component.siteId = 0;
    component.formGroup.controls['name'].setValue('Test user');
    component.formGroup.controls['email'].setValue('test@example.com');
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.updateOrgContact).toHaveBeenCalled();
  });
});
