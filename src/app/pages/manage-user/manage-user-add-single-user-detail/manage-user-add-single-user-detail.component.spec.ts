import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ManageUserAddSingleUserDetailComponent } from './manage-user-add-single-user-detail.component';

describe('ManageUserAddSingleUserDetailComponent', () => {
  let component: ManageUserAddSingleUserDetailComponent;
  let fixture: ComponentFixture<ManageUserAddSingleUserDetailComponent>;
  let submitButton: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ManageUserAddSingleUserDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserAddSingleUserDetailComponent);
    component = fixture.componentInstance;
    submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the form', () => {
    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeTruthy();
  });

  it('should disable submit button if form is invalid', () => {
    component.formGroup.controls.firstName.setValue('');
    component.formGroup.controls.lastName.setValue('');
    component.formGroup.controls.userName.setValue('');
    fixture.detectChanges();
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should enable submit button if form is valid', () => {
    component.formGroup.controls.firstName.setValue('John');
    component.formGroup.controls.lastName.setValue('Doe');
    component.formGroup.controls.userName.setValue('johndoe@example.com');
    fixture.detectChanges();
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('should display error message for required fields', () => {
    component.formGroup.controls.firstName.markAsTouched();
    component.formGroup.controls.lastName.markAsTouched();
    component.formGroup.controls.userName.markAsTouched();
    fixture.detectChanges();
    const errorMessages = fixture.debugElement.queryAll(
      By.css('.govuk-error-message')
    );
    expect(errorMessages.length).toBe(3);
  });

  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'onSubmit');
    component.formGroup.controls.firstName.setValue('John');
    component.formGroup.controls.lastName.setValue('Doe');
    component.formGroup.controls.userName.setValue('johndoe@example.com');
    fixture.detectChanges();
    const formElement = fixture.debugElement.query(By.css('form'));
    formElement.triggerEventHandler('submit', null);
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
