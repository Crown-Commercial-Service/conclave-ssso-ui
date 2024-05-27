import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfileComponent } from './user-profile-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RollbarErrorService } from '../../shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from '../../logging/rollbar';
import { TokenService } from '../../services/auth/token.service';
import { By } from '@angular/platform-browser';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { of, throwError } from 'rxjs';
import { OperationEnum } from 'src/app/constants/enum';
import { WrapperUserContactService } from 'src/app/services/wrapper/wrapper-user-contact.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Store, useFactory: () => ({}) },
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const pageTitle = fixture.nativeElement.querySelector('.page-title');
    expect(pageTitle.textContent).toContain('MANAGE_MY_ACCOUNT');
  });

  it('should have a form with formGroup', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
    expect(component.formGroup).toBeTruthy();
  });

  it('should have input fields for first name and last name', () => {
    const firstNameInput = fixture.nativeElement.querySelector('#first-name');
    const lastNameInput = fixture.nativeElement.querySelector('#last-name');
    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
  });

  it('should have a submit button', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton).toBeTruthy();
  });

  it('should display the correct breadcrumb links for admin user', () => {
    component.isAdminUser = true;
    fixture.detectChanges();
    const breadcrumbLinks = fixture.debugElement.queryAll(
      By.css('.govuk-breadcrumbs__link')
    );
    expect(breadcrumbLinks.length).toBe(2);
    expect(breadcrumbLinks[0].nativeElement.textContent).toContain(
      ' Public Procurement Gateway dashboard '
    );
    // expect(breadcrumbLinks[0].nativeElement.textContent).toContain(
    //   'ADMINISTRATOR_DASHBOARD'
    // );
    expect(breadcrumbLinks[1].nativeElement.textContent).toContain(
      'MANAGE_MY_ACCOUNT'
    );
  });

  it('should set the correct tabConfig values when tabChanged is called with "user-service"', () => {
    component.tabChanged('user-service');
    expect(component.tabConfig.userservices).toBeTrue();
    expect(component.tabConfig.groupservices).toBeFalse();
  });

  it('should set the correct tabConfig values when tabChanged is called with "group-service"', () => {
    component.tabChanged('group-service');
    expect(component.tabConfig.userservices).toBeFalse();
    expect(component.tabConfig.groupservices).toBeTrue();
  });

  it('should call the getUserContact method when getUserContact is called', () => {
    spyOn(component, 'getUserContact');
    component.getUserContact('testUser');
    expect(component.getUserContact).toHaveBeenCalledWith('testUser');
  });

  it('should navigate to the change-password route when onChangePasswordClick is called', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    component.onChangePasswordClick('Change password');
    expect(routerSpy).toHaveBeenCalledWith(
      'change-password'
    );
  });

  it('should navigate to the user-contact-edit route with the correct data when onContactEditRow is called', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    const dataRow = { contactId: 123 };
    component.onContactEditRow(dataRow);
    const expectedData = { isEdit: true, contactId: 123 };
    expect(routerSpy).toHaveBeenCalledWith(
      `user-contact-edit?data=${JSON.stringify(expectedData)}`
    );
  });

  it('should navigate to the user-contact-edit route with the correct data when onContactAddClick is called', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    component.onContactAddClick('Contact add');
    const expectedData = { isEdit: false, contactId: 0, isEditContact: false };
    expect(routerSpy).toHaveBeenCalledWith(
      `user-contact-edit?data=${JSON.stringify(expectedData)}`
    );
  });

  it('should update the user profile when the form is submitted successfully', () => {
    const userService = TestBed.inject(WrapperUserService);
    const authService = TestBed.inject(AuthService);
    spyOn(userService, 'updateUser').and.returnValue(of({}));
    spyOn(authService, 'renewAccessToken').and.returnValue();
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

    const form = component.formGroup;
    form.setValue({
      firstName: 'first',
      lastName: 'last',
      mfaEnabled: true,
    });
    fixture.detectChanges();
    component.onSubmit(form);
    expect(userService.updateUser).toHaveBeenCalledWith(
      component.userName,
      component.userRequest
    );
    expect(authService.renewAccessToken).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(
      `operation-success/${OperationEnum.MyAccountUpdate}`
    );
  });

  it('should display an error message when updating the user profile fails', () => {
    const userService = TestBed.inject(WrapperUserService);
    const authService = TestBed.inject(AuthService);
    const errorMessage = 'Failed to update user profile';
    spyOn(userService, 'updateUser').and.returnValue(throwError(errorMessage));
    spyOn(authService, 'renewAccessToken').and.returnValue();
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

    const form = component.formGroup;
    form.setValue({
      firstName: 'first',
      lastName: 'last',
      mfaEnabled: true,
    });
    fixture.detectChanges();
    component.onSubmit(form);
    expect(userService.updateUser).toHaveBeenCalledWith(
      component.userName,
      component.userRequest
    );
    expect(authService.renewAccessToken).not.toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should scroll to the specified anchor when scrollToAnchor is called', () => {
    const viewportScrollerSpy = spyOn(TestBed.inject(ViewportScroller), 'scrollToAnchor');    
    component.scrollToAnchor('section1');
    expect(viewportScrollerSpy).toHaveBeenCalledWith(
      'section1'
    );
  });

  it('should get the approval required roles when getApprovalRequriedRoles is called', () => {
    const orgGroupService = TestBed.inject(WrapperOrganisationGroupService)
    spyOn(
      orgGroupService,
      'getOrganisationApprovalRequiredRoles'
    ).and.returnValue(of([]));
    component.getApprovalRequriedRoles();
    expect(component.approveRequiredRole).toEqual([]);
  });

  it('should get the organisation details when getOrgDetails is called', () => {    
    spyOn(TestBed.inject(WrapperOrganisationService), 'getOrganisation').and.returnValue(
      of({})
    );
    component.getOrgDetails();
    expect(component.organisationDetails).toEqual({});
  });

  it('should get the pending approval user role when getPendingApprovalUserRole is called', () => {
    const userService = TestBed.inject(WrapperUserService);
    spyOn(userService, 'getPendingApprovalUserRole').and.returnValue(
      of({
        detail: {
          id: 1,
          canChangePassword: true,
        },
        userName: 'name',
        organisationId: 'org',
        title: 'title',
        firstName: 'first name',
        lastName: 'last name',
        mfaEnabled: true,
        isAdminUser: false,
        mfaOpted: true,
        isDormant:false
      })
    );
    component.getPendingApprovalUserRole();
    expect(component.pendingRoleDetails).toEqual([]);
  });

  it('should retrieve user contacts when getUserContact is called', () => {
    const userContactService = TestBed.inject(WrapperUserContactService);
    const mockUserContacts = [
      { contactId: 1, name: 'test 1', email: 'test@example.com', contacts: [] },
      {
        contactId: 2,
        name: 'test 2',
        email: 'test2@example.com',
        contacts: [],
      },
    ];
    spyOn(userContactService, 'getUserContacts').and.returnValue(
      of({ contactPoints: mockUserContacts })
    );
    component.getUserContact('testUser');
    fixture.detectChanges();
    expect(userContactService.getUserContacts).toHaveBeenCalledWith('testUser');
  });

  it('should display the user profile details correctly', () => {
    component.formGroup.controls.firstName.setValue('test');
    component.formGroup.controls.lastName.setValue('user');
    component.userName = 'test@example.com';
    component.userTypeDetails = {
      title: 'User type',
      description: '',
      data: [],
      isGrayOut: null,
      selectedValue: '',
    };
    component.noneGroupsMember = {
      isAdmin: false,
      headerText: 'Groups I am not a member of',
      headerTextKey: 'groupName',
      accessTable: 'noneGroupsMember',
      noRoleText: 'This group is not assigned with access to any service.',
      noDatanoneGroupsMemberMessage:
        'There are no unassigned groups available for you.',
      groupShow: false,
      data: [],
    };
    component.groupsMember = {
      isAdmin: false,
      headerText: 'Groups I am a member of',
      headerTextKey: 'groupName',
      accessTable: 'groupsMember',
      noRoleText:
        'You do not have access to any service through membership of this group.',
      noDataGroupsMemberMessage: 'You are not a member of any group.',
      groupShow: true,
      data: [],
    };
    component.roleDataList = [];
    component.orgUserGroupRoles = [];
    component.userContacts = [];

    fixture.detectChanges();

    console.log(fixture.nativeElement.querySelector('#mfaEnabled'));
    const firstNameInput = fixture.nativeElement.querySelector('#first-name');
    const lastNameInput = fixture.nativeElement.querySelector('#last-name');
    const emailInput = fixture.nativeElement.querySelector('#email');
    const additionalSecurityCheckbox = fixture.nativeElement.querySelector('input[formControlName="mfaEnabled"]');
    const contactDetails = fixture.nativeElement.querySelector('.contact-detail');
    const saveButton = fixture.nativeElement.querySelector('.save-cancel-button-group button');

    expect(firstNameInput.value).toBe('test');
    expect(lastNameInput.value).toBe('user');
    expect(emailInput.value).toBe('test@example.com');
    expect(additionalSecurityCheckbox.checked).toBeFalsy();
    expect(contactDetails).toBeTruthy();
    expect(saveButton.disabled).toBeTruthy();
  });

  it('should display the correct role or service information', () => {
    component.showRoleView = true;
    component.detailsData = [
      'Role details',
      'Service details',
      'Role or service details',
    ];
    component.roleDataList = [];
    component.isAdminUser = true;

    fixture.detectChanges();

    const roleDetails = fixture.debugElement.query(
      By.css('.role_view')
    ).nativeElement;
    const serviceDetails = fixture.nativeElement.querySelector('.service_view');

    expect(roleDetails).toBeTruthy();
    expect(serviceDetails).toBeFalsy();
  });

  it('should display the correct group access information', () => {
    component.orgUserGroupRoles = [
      {
        id: 1,
        name: 'Group 1',
        approvalStatus: 0,
        description: 'Group 1 description',
      },
      {
        id: 2,
        name: 'Group 2',
        approvalStatus: 1,
        description: 'Group 2 description',
      },
    ];
    component.isAdminUser = true;

    fixture.detectChanges();

    const groupAccessInfo = fixture.debugElement.query(
      By.css('.govuk-tabs__panel#group-service')
    ).nativeElement;
    const groupAccessItems = fixture.debugElement.queryAll(
      By.css('.govuk-checkboxes__item')
    );

    expect(groupAccessInfo).toBeTruthy();
    expect(groupAccessItems.length).toBe(2);
  });

  it('should display the correct contact details', () => {
    component.userContacts = [
      {
        contactId: 1,
      },
      {
        contactId: 2,
      },
    ];

    fixture.detectChanges();

    const contactTable = fixture.debugElement.query(By.css('app-govuk-table'));

    expect(contactTable).toBeTruthy();
  });

  it('should enable the save button when there are form changes', () => {
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(
      By.css('.save-cancel-button-group button')
    ).nativeElement;

    expect(saveButton.disabled).toBeTruthy();
  });
});
