import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { CIIOptions } from './cii-options.component';
import { ciiService } from 'src/app/services/cii/cii.service';
import { TranslateModule } from '@ngx-translate/core';

describe('CIIOptionsComponent', () => {
  let component: CIIOptions;
  let fixture: ComponentFixture<CIIOptions>;
  let mockCiiService: jasmine.SpyObj<ciiService>;
  let mockStore: jasmine.SpyObj<Store<any>>;

  beforeEach(async () => {
    mockCiiService = jasmine.createSpyObj('ciiService', ['getSchemes']);
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      declarations: [CIIOptions],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ciiService, useValue: mockCiiService },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CIIOptions);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set up the form and fetch schemes', () => {
      const mockSchemes = [
        { scheme: 'GB-COH', schemeName: 'Companies House' },
        {
          scheme: 'GB-CHC',
          schemeName: 'Charity Commission for England and Wales',
        },
      ];
      mockCiiService.getSchemes.and.returnValue(of(mockSchemes));

      component.ngOnInit();

      expect(component.dunNumber).toBeDefined();
      expect(component.items$).toBeDefined();
      expect(mockCiiService.getSchemes).toHaveBeenCalled();
      expect(component.scheme).toEqual(mockSchemes[0].scheme);
      expect(component.schemeName).toEqual(mockSchemes[0].schemeName);
    });
  });

  describe('onSubmit', () => {
    it('should emit the selected organization when txtValue is not empty', () => {
      const mockOrgValue = '123456789';
      component.txtValue = mockOrgValue;
      spyOn(component.onOrgSeleceted, 'emit');

      component.onSubmit();

      expect(component.onOrgSeleceted.emit).toHaveBeenCalledWith(mockOrgValue);
    });

    it('should scroll to error-summary when txtValue is empty', () => {
      component.txtValue = '';
      spyOn(component.scrollHelper, 'scrollToFirst');

      component.onSubmit();

      expect(component.scrollHelper.scrollToFirst).toHaveBeenCalledWith(
        'error-summary'
      );
    });
  });

  describe('Template', () => {
    beforeEach(() => {
      const mockSchemes = [
        { scheme: 'GB-COH', schemeName: 'Companies House' },
        {
          scheme: 'GB-CHC',
          schemeName: 'Charity Commission for England and Wales',
        },
      ];
      mockCiiService.getSchemes.and.returnValue(of(mockSchemes));

      fixture.detectChanges();
    });

    it('should display the error summary when submitted and txtValue is empty', () => {
      component.submitted = true;
      component.txtValue = '';
      fixture.detectChanges();

      const errorSummary = fixture.debugElement.query(
        By.css('.govuk-error-summary')
      );
      expect(errorSummary).toBeTruthy();
    });

    it('should display the error message for entering a registry number when activeElement is not US-DUN', () => {
      component.submitted = true;
      component.txtValue = '';
      component.validationObj.activeElement = 'GB-COH';
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(
        By.css('.govuk-error-summary__body ul li a')
      );
      expect(errorMessage.nativeElement.textContent).toContain(
        'ERROR_ENTER_REGISTRY_NUMBER'
      );
    });

    it('should display the error message for entering a valid identifier number when activeElement is US-DUN and isDunlength is true', () => {
      component.submitted = true;
      component.validationObj.activeElement = 'US-DUN';
      component.validationObj.isDunlength = true;
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(
        By.css('.govuk-error-summary__body ul li a')
      );
      expect(errorMessage.nativeElement.textContent).toContain(
        'ERROR_ENTER_REGISTRY_NUMBER'
      );
    });

    it('should display the error message for entering a valid identifier number when activeElement is US-DUN, DunData is not empty, and stringIdentifier is true', () => {
      component.submitted = true;
      component.validationObj.activeElement = 'US-DUN';
      component.validationObj.DunData = '123456789@';
      component.validationObj.stringIdentifier = true;
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(
        By.css('.govuk-error-summary__body ul li a')
      );
      expect(errorMessage.nativeElement.textContent).toContain(
        'Enter a valid identifier number'
      );
    });

    it('should display the form fields and buttons correctly', () => {
      const formFields = fixture.debugElement.queryAll(
        By.css('.govuk-form-group')
      );
      const radioButtons = fixture.debugElement.queryAll(
        By.css('.govuk-radios__input')
      );
      const continueButton = fixture.debugElement.query(
        By.css('#continueButton')
      );

      expect(formFields.length).toBe(1);
      expect(radioButtons.length).toBe(2);
      expect(continueButton.nativeElement.textContent).toContain('Continue');
    });

    it('should emit the selected organization when continue button is clicked and txtValue is not empty', () => {
      const mockOrgValue = '123456789';
      component.txtValue = mockOrgValue;
      spyOn(component.onOrgSeleceted, 'emit');

      const continueButton = fixture.debugElement.query(
        By.css('#continueButton')
      );
      continueButton.triggerEventHandler('click', null);

      expect(component.onOrgSeleceted.emit).toHaveBeenCalledWith(mockOrgValue);
    });

    it('should scroll to error-summary when continue button is clicked and txtValue is empty', () => {
      component.txtValue = '';
      spyOn(component.scrollHelper, 'scrollToFirst');

      const continueButton = fixture.debugElement.query(
        By.css('#continueButton')
      );
      continueButton.triggerEventHandler('click', null);

      expect(component.scrollHelper.scrollToFirst).toHaveBeenCalledWith(
        'error-summary'
      );
    });
  });
});
