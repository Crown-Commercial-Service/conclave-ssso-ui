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
      'ADMINISTRATOR_DASHBOARD'
    );
    expect(breadcrumbLinks[1].nativeElement.textContent).toContain(
      'MANAGE_MY_ACCOUNT'
    );
  });

  it('should display the correct breadcrumb links for non-admin user', () => {
    component.isAdminUser = false;
    fixture.detectChanges();
    const breadcrumbLinks = fixture.debugElement.queryAll(
      By.css('.govuk-breadcrumbs__link')
    );
    expect(breadcrumbLinks.length).toBe(2);
    expect(breadcrumbLinks[0].nativeElement.textContent).toContain(
      'PUBLIC_PROCUREMENT_GATEWAY_DASHBOARD'
    );
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
    spyOn(component.router, 'navigateByUrl');
    component.onChangePasswordClick();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'change-password'
    );
  });

  it('should navigate to the user-contact-edit route with the correct data when onContactEditRow is called', () => {
    spyOn(component.router, 'navigateByUrl');
    const dataRow = { contactId: 123 };
    component.onContactEditRow(dataRow);
    const expectedData = { isEdit: true, contactId: 123 };
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      `user-contact-edit?data=${JSON.stringify(expectedData)}`
    );
  });

  it('should navigate to the user-contact-edit route with the correct data when onContactAddClick is called', () => {
    spyOn(component.router, 'navigateByUrl');
    component.onContactAddClick();
    const expectedData = { isEdit: false, contactId: 0 };
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      `user-contact-edit?data=${JSON.stringify(expectedData)}`
    );
  });

  it('should update the user profile when the form is submitted successfully', () => {
    const userService = TestBed.inject(WrapperUserService);
    spyOn(userService, 'updateUser').and.returnValue(of({}));
    spyOn(component.authService, 'renewAccessToken').and.returnValue();
    const routerSpy = spyOn(component.router, 'navigateByUrl');

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
    expect(component.authService.renewAccessToken).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(
      `operation-success/${OperationEnum.MyAccountUpdate}`
    );
  });

  it('should display an error message when updating the user profile fails', () => {
    const userService = TestBed.inject(WrapperUserService);
    const errorMessage = 'Failed to update user profile';
    spyOn(userService, 'updateUser').and.returnValue(throwError(errorMessage));
    spyOn(component.authService, 'renewAccessToken').and.returnValue();
    const routerSpy = spyOn(component.router, 'navigateByUrl');

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
    expect(component.authService.renewAccessToken).not.toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should scroll to the specified anchor when scrollToAnchor is called', () => {
    spyOn(component.viewportScroller, 'scrollToAnchor');
    component.scrollToAnchor('section1');
    expect(component.viewportScroller.scrollToAnchor).toHaveBeenCalledWith(
      'section1'
    );
  });

  it('should get the approval required roles when getApprovalRequriedRoles is called', () => {
    spyOn(
      component.orgGroupService,
      'getOrganisationApprovalRequiredRoles'
    ).and.returnValue(of([]));
    component.getApprovalRequriedRoles();
    expect(component.approveRequiredRole).toEqual([]);
  });

  it('should get the organisation details when getOrgDetails is called', () => {
    spyOn(component.organisationService, 'getOrganisation').and.returnValue(
      of({})
    );
    component.getOrgDetails();
    expect(component.organisationDetails).toEqual({});
  });

  it('should get the pending approval user role when getPendingApprovalUserRole is called', () => {
    spyOn(component.userService, 'getPendingApprovalUserRole').and.returnValue(
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
});
