import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FindDelegatedUserComponent } from './find-delegated-user.component';
import { of, throwError } from 'rxjs';

describe('FindDelegatedUserComponent', () => {
  let component: FindDelegatedUserComponent;
  let fixture: ComponentFixture<FindDelegatedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindDelegatedUserComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindDelegatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required validators', () => {
    const emailControl = component.formGroup.get('email');

    expect(emailControl).toBeTruthy();
    expect(emailControl?.value).toBe('');
    expect(emailControl?.validator).toBeTruthy();
    expect(emailControl?.errors?.required).toBeTruthy();
  });

  it('should set focus on the email input field', () => {
    spyOn(document, 'getElementById').and.callThrough();
    component.setFocus({});
    expect(document.getElementById).toHaveBeenCalledWith('email');
  });

  it('should return true for formValid if form is valid', () => {
    const emailControl = component.formGroup.get('email');
    emailControl?.setValue('validemail@example.com');

    expect(component.formValid(component.formGroup)).toBe(true);
  });

  it('should handle error response on GetUserStatus', () => {
    spyOn(
      component.WrapperUserDelegatedService,
      'getuserDetail'
    ).and.returnValue(throwError({ status: 404 }));
    spyOn(component.route, 'navigateByUrl');

    const emailControl = component.formGroup.get('email');
    emailControl?.setValue('test@example.com');

    component.GetUserStatus(component.formGroup, 'Continue');

    expect(component.submitted).toBe(true);
    expect(
      component.WrapperUserDelegatedService.getuserDetail
    ).toHaveBeenCalledWith('test@example.com', component.organisationId);
    expect(component.route.navigateByUrl).toHaveBeenCalledWith(
      'delegated-user-status?data=' +
        btoa(
          JSON.stringify({
            header: 'We could not find this user in our system',
            Description:
              'This Email address does not exist in our database. Please make sure that the Email address you entered is correct or contact the User you want to give the delegated access to.',
            Breadcrumb: 'User not found',
            status: '002',
          })
        )
    );
  });

  it('should handle other error status on GetUserStatus', () => {
    spyOn(
      component.WrapperUserDelegatedService,
      'getuserDetail'
    ).and.returnValue(throwError({ status: 500 }));
    spyOn(component.route, 'navigateByUrl');

    const emailControl = component.formGroup.get('email');
    emailControl?.setValue('test@example.com');

    component.GetUserStatus(component.formGroup, 'Continue');

    expect(component.submitted).toBe(true);
    expect(
      component.WrapperUserDelegatedService.getuserDetail
    ).toHaveBeenCalledWith('test@example.com', component.organisationId);
    expect(component.route.navigateByUrl).toHaveBeenCalledWith(
      'delegated-error'
    );
  });

  it('should navigate back on Cancel', () => {
    spyOn(window.history, 'back');

    component.Cancel('Cancel');

    expect(window.history.back).toHaveBeenCalled();
  });
});
