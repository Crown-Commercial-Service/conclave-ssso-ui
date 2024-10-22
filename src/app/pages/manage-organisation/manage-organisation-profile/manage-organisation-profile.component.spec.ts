import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
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

  it('should display site details in the template', () => {
    component.siteData = [
      {
        siteId: 1,
        siteName: 'Site 1',
        streetAddress: 'Test Street1',
        postalCode: '12345',
        countryCode: 'UK',
        routeLink: '/manage-org/profile/site/edit',
        routeData: {data: JSON.stringify({
          'isEdit': true,
          'siteId': 1
      })}
      },
      {
        siteId: 2,
        siteName: 'Site 2',
        streetAddress: 'Test Street2',
        postalCode: '67890',
        countryCode: 'IN',
        routeLink: '/manage-org/profile/site/edit',
        routeData: {data: JSON.stringify({
          'isEdit': true,
          'siteId': 1
      })}
      },
    ];
    fixture.detectChanges();

    const siteRows =
      fixture.nativeElement.querySelectorAll('.govuk-table__row');
    expect(siteRows.length).toBe(2);

    const firstSiteRow = siteRows[0];
    expect(firstSiteRow.textContent).toContain('Registry');
    expect(firstSiteRow.textContent).toContain('ID');
    expect(firstSiteRow.textContent).toContain('Legal name');
    expect(firstSiteRow.textContent).toContain('');
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
    expect(registryRows.length).toBe(2);

    const firstRegistryRow = registryRows[0];
    expect(firstRegistryRow.textContent).toContain('Registry');
    expect(firstRegistryRow.textContent).toContain('ID');
    expect(firstRegistryRow.textContent).toContain('Legal name');

    const secondRegistryRow = registryRows[1];
    expect(secondRegistryRow.textContent).toContain('Registry 1');
    expect(secondRegistryRow.textContent).toContain('123');
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
