import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ContactUsComponent } from './contactus.component';
import { ViewportScroller } from '@angular/common';
import { PatternService } from 'src/app/shared/pattern.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  
  const mockStore = {
    select: () => of({}),
    dispatch: () => {},
  };
  const mockViewportScroller = {
    scrollToPosition: () => {},
  };
  const mockPatternService = {
    emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    emailValidator: () => true, 
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContactUsComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: PatternService, useValue: mockPatternService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.formGroup).toBeDefined();
  });

  it('should set submitted to true on form submission', () => {
    component.onSubmit(component.formGroup, 'Send Enquiry');
    expect(component.submitted).toBeTruthy();
  });

  it('should validate email using emailValidator', () => {
    spyOn(mockPatternService, 'emailValidator').and.returnValue(true);
    component.formGroup.controls['email'].setValue('test@example.com');
    component.onSubmit(component.formGroup, 'Send Enquiry');
    expect(mockPatternService.emailValidator).toBeTruthy();
  });

  it('should set email control error when email is invalid', () => {
    spyOn(mockPatternService, 'emailValidator').and.returnValue(false);
    component.formGroup.controls['email'].setValue('invalid-email');
    component.onSubmit(component.formGroup,'Send Enquiry');
    expect(component.formGroup.controls['email'].hasError('incorrect')).toBeFalsy();
  });

  it('should return true for formValid when form is valid', () => {
    component.formGroup.controls['firstName'].setValue('John');
    component.formGroup.controls['email'].setValue('test@example.com');
    expect(component.formValid(component.formGroup)).toBeTruthy();
  });

  it('should return false for formValid when form is invalid', () => {
    expect(component.formValid(component.formGroup)).toBeFalsy();
  });
});
