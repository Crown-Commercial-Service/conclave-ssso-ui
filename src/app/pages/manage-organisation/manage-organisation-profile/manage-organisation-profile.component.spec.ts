import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ManageOrganisationProfileComponent } from './manage-organisation-profile.component';
import { ciiService } from 'src/app/services/cii/cii.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { WrapperOrganisationContactService } from 'src/app/services/wrapper/wrapper-org-contact-service';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

describe('ManageOrganisationProfileComponent', () => {
  let component: ManageOrganisationProfileComponent;
  let fixture: ComponentFixture<ManageOrganisationProfileComponent>;
  let mockCiiService: jasmine.SpyObj<ciiService>;
  let mockTokenService: jasmine.SpyObj<TokenService>;
  let mockOrganisationService: jasmine.SpyObj<WrapperOrganisationService>;
  let mockOrganisationGroupService: jasmine.SpyObj<WrapperOrganisationGroupService>;
  let mockConfigurationService: jasmine.SpyObj<WrapperConfigurationService>;
  let mockContactService: jasmine.SpyObj<WrapperOrganisationContactService>;
  let mockSiteService: jasmine.SpyObj<WrapperOrganisationSiteService>;
  let mockContactHelper: jasmine.SpyObj<ContactHelper>;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    mockCiiService = jasmine.createSpyObj('ciiService', [
      'getSchemes',
      'getOrgDetails',
    ]);
    mockTokenService = jasmine.createSpyObj('TokenService', ['getCiiOrgId']);
    mockOrganisationService = jasmine.createSpyObj(
      'WrapperOrganisationService',
      ['getOrganisation']
    );
    mockOrganisationGroupService = jasmine.createSpyObj(
      'WrapperOrganisationGroupService',
      ['getOrganisationIdentityProviders', 'enableIdentityProvider']
    );
    mockConfigurationService = jasmine.createSpyObj(
      'WrapperConfigurationService',
      ['getIdentityProviders']
    );
    mockContactService = jasmine.createSpyObj(
      'WrapperOrganisationContactService',
      ['getOrganisationContacts']
    );
    mockSiteService = jasmine.createSpyObj('WrapperOrganisationSiteService', [
      'getOrganisationSites',
    ]);
    mockContactHelper = jasmine.createSpyObj('ContactHelper', [
      'getContactGridInfoList',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationProfileComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ciiService, useValue: mockCiiService },
        { provide: TokenService, useValue: mockTokenService },
        {
          provide: WrapperOrganisationService,
          useValue: mockOrganisationService,
        },
        {
          provide: WrapperOrganisationGroupService,
          useValue: mockOrganisationGroupService,
        },
        {
          provide: WrapperConfigurationService,
          useValue: mockConfigurationService,
        },
        {
          provide: WrapperOrganisationContactService,
          useValue: mockContactService,
        },
        { provide: WrapperOrganisationSiteService, useValue: mockSiteService },
        { provide: ContactHelper, useValue: mockContactHelper },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationProfileComponent);
    component = fixture.componentInstance;
    mockCiiService.getSchemes.and.returnValue(of([]));
    mockCiiService.getOrgDetails.and.returnValue(of({}));
    mockOrganisationService.getOrganisation.and.returnValue(of({}));
    mockOrganisationGroupService.getOrganisationIdentityProviders.and.returnValue(
      of([])
    );
    mockConfigurationService.getIdentityProviders.and.returnValue(of([]));
    mockContactService.getOrganisationContacts.and.returnValue(of({}));
    mockSiteService.getOrganisationSites.and.returnValue(of({}));
    mockContactHelper.getContactGridInfoList.and.returnValue([]);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load organization data on initialization', () => {
    expect(mockOrganisationService.getOrganisation).toHaveBeenCalled();
    expect(
      mockOrganisationGroupService.getOrganisationIdentityProviders
    ).toHaveBeenCalled();
    expect(mockConfigurationService.getIdentityProviders).toHaveBeenCalled();
    expect(mockContactService.getOrganisationContacts).toHaveBeenCalled();
    expect(mockCiiService.getOrgDetails).toHaveBeenCalled();
    expect(mockSiteService.getOrganisationSites).toHaveBeenCalled();
  });

  it('should display organization details in the template', () => {
    component.org = {
      identifier: { legalName: 'Test Organization' },
      address: {
        streetAddress: '123 Test Street',
        locality: 'Test City',
        region: 'Test Region',
        postalCode: '12345',
        countryName: 'Test Country',
      },
    };
    fixture.detectChanges();

    const orgName = fixture.nativeElement.querySelector('strong');
    expect(orgName.textContent).toContain('Test Organization');

    const orgAddress = fixture.nativeElement.querySelector('p');
    expect(orgAddress.textContent).toContain('123 Test Street');
    expect(orgAddress.textContent).toContain('Test City');
    expect(orgAddress.textContent).toContain('Test Region');
    expect(orgAddress.textContent).toContain('12345');
    expect(orgAddress.textContent).toContain('Test Country');
  });

  it('should display contact details in the template', () => {
    component.contactData = [
      {
        contactReason: 'Reason 1',
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        mobileNumber: '9876543210',
        fax: '1234',
        webUrl: 'example.com',
      },
      {
        contactReason: 'Reason 2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phoneNumber: '0987654321',
        mobileNumber: '6789012345',
        fax: '5678',
        webUrl: 'example.org',
      },
    ];
    fixture.detectChanges();

    const contactRows =
      fixture.nativeElement.querySelectorAll('.govuk-table__row');
    expect(contactRows.length).toBe(2);

    const firstContactRow = contactRows[0];
    expect(firstContactRow.textContent).toContain('Reason 1');
    expect(firstContactRow.textContent).toContain('John Doe');
    expect(firstContactRow.textContent).toContain('john@example.com');
    expect(firstContactRow.textContent).toContain('1234567890');
    expect(firstContactRow.textContent).toContain('9876543210');
    expect(firstContactRow.textContent).toContain('1234');
    expect(firstContactRow.textContent).toContain('example.com');

    const secondContactRow = contactRows[1];
    expect(secondContactRow.textContent).toContain('Reason 2');
    expect(secondContactRow.textContent).toContain('Jane Smith');
    expect(secondContactRow.textContent).toContain('jane@example.com');
    expect(secondContactRow.textContent).toContain('0987654321');
    expect(secondContactRow.textContent).toContain('6789012345');
    expect(secondContactRow.textContent).toContain('5678');
    expect(secondContactRow.textContent).toContain('example.org');
  });

  it('should display site details in the template', () => {
    component.siteData = [
      {
        siteId: 1,
        siteName: 'Site 1',
        streetAddress: 'Test Street1',
        postalCode: '12345',
        countryCode: 'UK',
      },
      {
        siteId: 2,
        siteName: 'Site 2',
        streetAddress: 'Test Street2',
        postalCode: '67890',
        countryCode: 'IN',
      },
    ];
    fixture.detectChanges();

    const siteRows =
      fixture.nativeElement.querySelectorAll('.govuk-table__row');
    expect(siteRows.length).toBe(2);

    const firstSiteRow = siteRows[0];
    expect(firstSiteRow.textContent).toContain('Site 1');
    expect(firstSiteRow.textContent).toContain('123 Test Street');
    expect(firstSiteRow.textContent).toContain('12345');
    expect(firstSiteRow.textContent).toContain('US');

    const secondSiteRow = siteRows[1];
    expect(secondSiteRow.textContent).toContain('Site 2');
    expect(secondSiteRow.textContent).toContain('456 Test Street');
    expect(secondSiteRow.textContent).toContain('67890');
    expect(secondSiteRow.textContent).toContain('CA');
  });

  it('should display registries in the template', () => {
    component.registries = {
      identifier: {
        scheme: 'scheme1',
        id: '123',
        legalName: 'Registry 1',
        uri: 'test url',
      },
      additionalIdentifiers: [
        { scheme: 'scheme2', id: '456', legalName: 'Registry 2' },
        { scheme: 'scheme3', id: '789', legalName: 'Registry 3' },
      ],
    };
    fixture.detectChanges();

    const registryRows =
      fixture.nativeElement.querySelectorAll('.govuk-table__row');
    expect(registryRows.length).toBe(3);

    const firstRegistryRow = registryRows[0];
    expect(firstRegistryRow.textContent).toContain('Registry 1');
    expect(firstRegistryRow.textContent).toContain('scheme1');
    expect(firstRegistryRow.textContent).toContain('123');

    const secondRegistryRow = registryRows[1];
    expect(secondRegistryRow.textContent).toContain('Registry 2');
    expect(secondRegistryRow.textContent).toContain('scheme2');
    expect(secondRegistryRow.textContent).toContain('456');

    const thirdRegistryRow = registryRows[2];
    expect(thirdRegistryRow.textContent).toContain('Registry 3');
    expect(thirdRegistryRow.textContent).toContain('scheme3');
    expect(thirdRegistryRow.textContent).toContain('789');
  });

  it('should trigger onContactAddClick method when "Add another contact" button is clicked', () => {
    spyOn(component, 'onContactAddClick');
    const addButton = fixture.nativeElement.querySelector(
      '.govuk-button--secondary:first-child'
    );
    addButton.click();
    expect(component.onContactAddClick).toHaveBeenCalled();
  });

  it('should trigger onContactAssignClick method when "Find and assign contact" button is clicked', () => {
    spyOn(component, 'onContactAssignClick');
    const assignButton = fixture.nativeElement.querySelector(
      '.govuk-button--secondary:last-child'
    );
    assignButton.click();
    expect(component.onContactAssignClick).toHaveBeenCalled();
  });
});
