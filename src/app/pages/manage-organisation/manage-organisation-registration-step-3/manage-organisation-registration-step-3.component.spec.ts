import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ManageOrgRegStep3Component } from './manage-organisation-registration-step-3.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { ciiService } from 'src/app/services/cii/cii.service';

describe('ManageOrgRegStep3Component', () => {
  let component: ManageOrgRegStep3Component;
  let fixture: ComponentFixture<ManageOrgRegStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegStep3Component],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [{ provide: Store, useFactory: () => ({}) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the organization details correctly', () => {
    const mockItem = {
      name: 'Test Organization',
      address: {
        streetAddress: '123 Test Street',
        locality: 'Test City',
        region: 'Test Region',
        postalCode: '12345',
        countryName: 'Test Country',
      },
      identifier: {
        id: '1234567890',
      },
    };

    component.item$ = of(mockItem);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.querySelector('strong').textContent).toContain(
      'Test Organization'
    );
    expect(element.querySelector('.govuk-form-group p').textContent).toContain(
      '123 Test Street'
    );
  });

  it('should set the selected country code correctly', () => {
    const mockCountryDetails = [
      { id: 1, countryName: 'Country 1', countryCode: 'C1' },
      { id: 2, countryName: 'Country 2', countryCode: 'C2' },
      { id: 3, countryName: 'Country 3', countryCode: 'C3' },
    ];

    component.countryDetails = mockCountryDetails;
    component.ngOnInit();
    fixture.detectChanges();

    component.countryCode = 'C2';
    fixture.detectChanges();

    const selectElement = fixture.nativeElement.querySelector('#country-code');
    expect(selectElement.value).toBe('C2');
  });

  it('should call onSubmit method when the continue button is clicked', () => {
    console.log(component.item$);
    spyOn(component, 'onSubmit');

    const buttonElement =
      fixture.nativeElement.querySelector('#continueButton');

    buttonElement.click();

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
