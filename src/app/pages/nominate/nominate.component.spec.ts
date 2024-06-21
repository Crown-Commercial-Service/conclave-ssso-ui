import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NominateComponent } from './nominate.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { PatternService } from 'src/app/shared/pattern.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { TranslateModule } from '@ngx-translate/core';

describe('NominateComponent', () => {
  let component: NominateComponent;
  let fixture: ComponentFixture<NominateComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let patternService: jasmine.SpyObj<PatternService>;
  let dataLayerService: jasmine.SpyObj<DataLayerService>;
  let sharedDataService: jasmine.SpyObj<SharedDataService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('AuthService', ['nominate']);
    patternService = jasmine.createSpyObj('PatternService', ['NameValidator', 'emailPattern', 'emailValidator']);
    dataLayerService = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent', 'pushFormStartEvent', 'pushFormSubmitEvent', 'pushFormErrorEvent', 'pushClickEvent']);
    sharedDataService = jasmine.createSpyObj('SharedDataService', ['NominiData']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [NominateComponent],
      imports: [
        ReactiveFormsModule, 
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
    ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authService },
        { provide: PatternService, useValue: patternService },
        { provide: DataLayerService, useValue: dataLayerService },
        { provide: SharedDataService, useValue: sharedDataService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ data: btoa(JSON.stringify({ some: 'data' })) })
          }
        },
        { provide: SessionService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Mocking pattern validators
    patternService.NameValidator = "^[a-zA-Z][a-z A-Z,.'-]*(?:\s+[a-zA-Z]+)?$";
    patternService.emailPattern= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    patternService.emailValidator.and.returnValue(false);

    fixture = TestBed.createComponent(NominateComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    patternService = TestBed.inject(PatternService) as jasmine.SpyObj<PatternService>;
    dataLayerService = TestBed.inject(DataLayerService) as jasmine.SpyObj<DataLayerService>;
    sharedDataService = TestBed.inject(SharedDataService) as jasmine.SpyObj<SharedDataService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;    
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group and query params', () => {
    fixture.detectChanges();
    expect(component.formGroup).toBeDefined();
    expect(component.pageAccessMode).toEqual({ some: 'data' });
  });

  it('should push page view event and form start event on ngOnInit', () => {
    component.ngOnInit();
    expect(dataLayerService.pushPageViewEvent).toHaveBeenCalled();
    expect(dataLayerService.pushFormStartEvent).toHaveBeenCalledWith(component.formId, component.formGroup);
  });

  it('should validate email length', () => {
    const mockEvent = { target: { value: 'test@example.com' } };
    component.validateEmailLength(mockEvent);
    expect(patternService.emailValidator).toHaveBeenCalledWith('test@example.com');        
  });

  it('should set email control error if email is invalid', () => {
    patternService.emailValidator.and.returnValue(true);
    const mockEvent = { target: { value: 'invalid-email' } };
    component.validateEmailLength(mockEvent);
    expect(component.formGroup.controls['email'].errors).toEqual({ incorrect: true });
  });

  it('should set submitted to true and handle form submission', async () => {
    component.formGroup.controls['firstName'].setValue('John');
    component.formGroup.controls['lastName'].setValue('Doe');
    component.formGroup.controls['email'].setValue('john.doe@example.com');
    component.submitted = true;

    authService.nominate.and.returnValue(of({}));

    await component.onSubmit(component.formGroup);   

    expect(component.submitted).toBeFalse();
    expect(dataLayerService.pushFormSubmitEvent).toHaveBeenCalledWith(component.formId);    
  });

  it('should push form error event if form is invalid', () => {
    component.formGroup.controls['firstName'].setValue('');
    component.formGroup.controls['lastName'].setValue('Doe');
    component.formGroup.controls['email'].setValue('john.doe@example.com');

    component.onSubmit(component.formGroup);

    expect(dataLayerService.pushFormErrorEvent).toHaveBeenCalledWith(component.formId);
  });

  it('should return false if form is invalid', () => {
    component.formGroup.controls['firstName'].setValue('');
    component.formGroup.controls['lastName'].setValue('Doe');
    component.formGroup.controls['email'].setValue('john.doe@example.com');

    expect(component.formValid(component.formGroup)).toBeFalse();
  });

  it('should set focus on input element', () => {
    const mockElementRef = { nativeElement: { focus: jasmine.createSpy('focus') } };
    component.inputs = { toArray: () => [mockElementRef] } as any;

    component.setFocus(0);
    expect(mockElementRef.nativeElement.focus).toHaveBeenCalled();
  });

  it('should focus on first name input if invalid', () => {
    const mockElementRef1 = { nativeElement: { focus: jasmine.createSpy('focus') } };
    const mockElementRef2 = { nativeElement: { focus: jasmine.createSpy('focus') } };
    component.inputs = { toArray: () => [mockElementRef1, mockElementRef2] } as any;

    component.formGroup.controls['firstName'].setValue('');
    component.formGroup.controls['lastName'].setValue('Doe');
    component.customFocum();
    expect(mockElementRef1.nativeElement.focus).toHaveBeenCalled();
  });

  it('should navigate back on goBack', () => {
    spyOn(window.history, 'back');
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should navigate to confirm org page on goConfirmOrgPage', () => {
    localStorage.setItem('schemeDetails', JSON.stringify({ scheme: 'testScheme', schemeID: '123' }));
    component.goConfirmOrgPage();
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-org/register/search/testScheme?id=123');
  });
});
