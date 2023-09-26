import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { FindDelegatedUserComponent } from './find-delegated-user.component';
import { PatternService } from 'src/app/shared/pattern.service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

describe('FindDelegatedUserComponent', () => {
  let component: FindDelegatedUserComponent;
  let fixture: ComponentFixture<FindDelegatedUserComponent>;
  let mockWrapperUserDelegatedService: Partial<WrapperUserDelegatedService>;

  beforeEach(async () => {
    mockWrapperUserDelegatedService = {
      getuserDetail: (
        email: string,
        organisationId: string
      ): Observable<any> => {
        // Mock the response of the getuserDetail method here
        return of({});
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [FindDelegatedUserComponent],
      providers: [
        { provide: PatternService, useValue: {} },
        {
          provide: WrapperUserDelegatedService,
          useValue: mockWrapperUserDelegatedService,
        },
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

  it('should render the page title correctly', () => {
    const pageTitle = fixture.debugElement.query(
      By.css('.page-title')
    ).nativeElement;
    expect(pageTitle.textContent).toContain('Find a user');
  });

  it('should display an error message if email is not provided', () => {
    component.formGroup.controls['email'].setValue('');
    component.submitted = true;
    fixture.detectChanges();

    const errorList = fixture.debugElement.queryAll(
      By.css('.govuk-error-summary__list li')
    );
    expect(errorList[0].nativeElement.textContent).toContain(
      'Enter your email address'
    );
  });

  it('should display an error message if email is not in the correct format', () => {
    component.formGroup.controls['email'].setValue('invalid_email');
    component.submitted = true;
    fixture.detectChanges();

    const errorList = fixture.debugElement.queryAll(
      By.css('.govuk-error-summary__list li')
    );
    expect(errorList[1].nativeElement.textContent).toContain(
      'Enter an email address in the correct format, like name@example.com'
    );
  });

  it('should display an error message if user already has delegated access', () => {
    spyOn(mockWrapperUserDelegatedService, 'getuserDetail').and.returnValue(
      of({ organisationId: component.organisationId })
    );
    component.formGroup.controls['email'].setValue('example@example.com');
    component.submitted = true;
    fixture.detectChanges();

    const errorList = fixture.debugElement.queryAll(
      By.css('.govuk-error-summary__list li')
    );
    expect(errorList[2].nativeElement.textContent).toContain(
      'User already has delegated access'
    );
  });

  // Add more test cases as needed

  it('should call GetUserStatus method when the Continue button is clicked', () => {
    spyOn(component, 'GetUserStatus');
    const continueButton = fixture.debugElement.query(
      By.css('.govuk-button[data-module="govuk-button"]')
    ).nativeElement;
    continueButton.click();
    expect(component.GetUserStatus).toHaveBeenCalled();
  });

  it('should call Cancel method when the Cancel button is clicked', () => {
    spyOn(component, 'Cancel');
    const cancelButton = fixture.debugElement.query(
      By.css('.govuk-button--secondary[data-module="govuk-button"]')
    ).nativeElement;
    cancelButton.click();
    expect(component.Cancel).toHaveBeenCalled();
  });
});
