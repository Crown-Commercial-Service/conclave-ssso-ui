import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ManageOrgRegStep3Component } from './manage-organisation-registration-step-3.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ManageOrgRegStep3Component', () => {
  let component: ManageOrgRegStep3Component;
  let fixture: ComponentFixture<ManageOrgRegStep3Component>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockStore: any;
  let localStore: any = {
    scheme_name: 'test-scheme-name',
    organisation_type: 'test-org-type',
  };

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockActivatedRoute = {
      snapshot: {
        queryParams: { id: '123' },
      },
      params: of({ scheme: 'ABC' }),
    };
    mockStore = jasmine.createSpyObj('Store', ['select']);

    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegStep3Component],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should initialize the component correctly', () => {
    expect(component.schemeName).toEqual('test-scheme-name');
    expect(component.selectedIdentifiers).toEqual([]);
    expect(component.routeParams).toBeDefined();
    expect(component.ciiOrgId).toEqual('');
    expect(component.countryDetails).toEqual([]);
    expect(component.topCountries).toEqual([]);
    expect(component.filteredCountryDetails).toBeDefined();
    expect(component.countryCodeCtrl).toBeDefined();
    expect(component.countryCode).toEqual('');
    expect(component.isInvalid).toBeFalsy();
    expect(component.pageAccessMode).toEqual('test-org-type');
  });

  it('should filter country details correctly', () => {
    component.countryDetails = [
      { id: 1, countryName: 'Ireland', countryCode: 'IE' },
      { id: 2, countryName: 'United States', countryCode: 'US' },
      { id: 3, countryName: 'United Kingdom', countryCode: 'UK' },
    ];
    component.filteredCountryDetails.subscribe((data) => {
      expect(data).toEqual(component.countryDetails);
    });
    component.filtercountryDetails();
  });

  it('should set top countries correctly', () => {
    component.countryDetails = [
      { id: 1, countryName: 'Ireland', countryCode: 'IE' },
      { id: 2, countryName: 'United States', countryCode: 'US' },
      { id: 3, countryName: 'United Kingdom', countryCode: 'UK' },
      { id: 4, countryName: 'Canada', countryCode: 'CA' },
    ];
    component.setTopCountries(false);
    expect(component.topCountries).toEqual([
      { id: 1, countryName: 'Ireland', countryCode: 'IE' },
      { id: 2, countryName: 'United States', countryCode: 'US' },
      { id: 3, countryName: 'United Kingdom', countryCode: 'UK' },
    ]);

    component.setTopCountries(true);
    expect(component.topCountries).toEqual([]);
  });

  it('should set focus on mat select box', () => {
    // component.setFocus();
    const mockFocus = jasmine.createSpy('focus');
    component.matselect = { focus: mockFocus } as any;

    component.setFocus();

    expect(mockFocus).toHaveBeenCalled();
    });

  it('should handle onChangecountry event correctly', () => {
    component.isInvalid = true; 
    const event = 'US';
    component.onChangecountry(event);
    expect(component.isInvalid).toBeFalse();
  });
});
