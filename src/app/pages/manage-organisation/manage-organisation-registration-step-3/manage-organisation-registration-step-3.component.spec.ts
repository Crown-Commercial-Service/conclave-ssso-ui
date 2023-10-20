import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ManageOrgRegStep3Component } from './manage-organisation-registration-step-3.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageOrgRegStep3Component', () => {
  let component: ManageOrgRegStep3Component;
  let fixture: ComponentFixture<ManageOrgRegStep3Component>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockStore: any;

  beforeEach(async () => {
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
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore },
      ],
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
    expect(component.schemeName).toEqual('');
    expect(component.selectedIdentifiers).toEqual([]);
    expect(component.routeParams).toBeDefined();
    expect(component.ciiOrgId).toEqual('');
    expect(component.countryDetails).toEqual([]);
    expect(component.topCountries).toEqual([]);
    expect(component.filteredCountryDetails).toBeDefined();
    expect(component.countryCodeCtrl).toBeDefined();
    expect(component.countryCode).toEqual('');
    expect(component.isInvalid).toBeFalsy();
    expect(component.pageAccessMode).toEqual('');
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
    component.setFocus();
  });

  it('should handle onChangecountry event correctly', () => {
    const event = 'US';
    component.onChangecountry(event);
  });
});
