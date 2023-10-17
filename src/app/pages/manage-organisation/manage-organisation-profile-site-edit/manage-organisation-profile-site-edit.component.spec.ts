import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';
import { ManageOrganisationSiteEditComponent } from './manage-organisation-profile-site-edit.component';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { WrapperSiteContactService } from 'src/app/services/wrapper/wrapper-site-contact-service';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { UIState } from 'src/app/store/ui.states';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrganisationSiteEditComponent', () => {
  let component: ManageOrganisationSiteEditComponent;
  let fixture: ComponentFixture<ManageOrganisationSiteEditComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let wrapperOrgSiteServiceSpy: jasmine.SpyObj<WrapperOrganisationSiteService>;
  let wrapperSiteContactServiceSpy: jasmine.SpyObj<WrapperSiteContactService>;
  let wrapperConfigServiceSpy: jasmine.SpyObj<WrapperConfigurationService>;
  let titleServiceSpy: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);
    const formBuilderStub = () => ({ group: (object: any) => ({}) });

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    wrapperOrgSiteServiceSpy = jasmine.createSpyObj(
      'WrapperOrganisationSiteService',
      [
        'getOrganisationSite',
        'updateOrganisationSite',
        'createOrganisationSite',
      ]
    );
    wrapperSiteContactServiceSpy = jasmine.createSpyObj(
      'WrapperSiteContactService',
      ['getSiteContacts']
    );
    wrapperConfigServiceSpy = jasmine.createSpyObj(
      'WrapperConfigurationService',
      ['getCountryDetails']
    );
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    activatedRouteStub = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        queryParams: {
          data: JSON.stringify({
            isEdit: true,
            siteId: 123,
          }),
        },
      },
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ManageOrganisationSiteEditComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Store, useValue: {} },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
        { provide: Title, useValue: titleServiceSpy },
        {
          provide: WrapperOrganisationSiteService,
          useValue: wrapperOrgSiteServiceSpy,
        },
        {
          provide: WrapperSiteContactService,
          useValue: wrapperSiteContactServiceSpy,
        },
        {
          provide: WrapperConfigurationService,
          useValue: wrapperConfigServiceSpy,
        },
        { provide: ContactHelper, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationSiteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('ngOnInit', () => {
  //   it('should set the page title', async () => {
  //     const expectedTitle = 'Edit - Site - CCS';
  //     await wrapperOrgSiteServiceSpy.getOrganisationSite.and.returnValue(
  //       of({})
  //     );
  //     await wrapperConfigServiceSpy.getCountryDetails.and.returnValue(of([]));

  //     component.ngOnInit();

  //     expect(titleServiceSpy.setTitle).toHaveBeenCalledWith(expectedTitle);
  //   });

  //   it('should fetch the site information when isEdit is true', async () => {
  //     const siteInfo = {
  //       siteName: 'Test Site',
  //       address: {
  //         streetAddress: '123 Test Street',
  //         locality: 'Test Locality',
  //         region: 'Test Region',
  //         postalCode: '12345',
  //         countryCode: 'US',
  //       },
  //     };
  //     await wrapperOrgSiteServiceSpy.getOrganisationSite.and.returnValue(
  //       of(siteInfo)
  //     );
  //     await wrapperConfigServiceSpy.getCountryDetails.and.returnValue(of([]));

  //     component.ngOnInit();

  //     expect(wrapperOrgSiteServiceSpy.getOrganisationSite).toHaveBeenCalledWith(
  //       component.organisationId,
  //       component.siteId
  //     );
  //     expect(component.formGroup.value).toEqual({
  //       name: siteInfo.siteName,
  //       streetAddress: siteInfo.address.streetAddress,
  //       locality: siteInfo.address.locality,
  //       region: siteInfo.address.region,
  //       postalCode: siteInfo.address.postalCode,
  //       countryCode: jasmine.any(Object),
  //     });
  //   });

  //   it('should not fetch the site information when isEdit is false', async () => {
  //     component.isEdit = false;
  //     await wrapperConfigServiceSpy.getCountryDetails.and.returnValue(of([]));

  //     component.ngOnInit();

  //     expect(
  //       wrapperOrgSiteServiceSpy.getOrganisationSite
  //     ).not.toHaveBeenCalled();
  //   });

  //   it('should fetch the country details', async () => {
  //     const countryDetails = [
  //       { id: 1, countryName: 'United States', countryCode: 'US' },
  //     ];
  //     await wrapperOrgSiteServiceSpy.getOrganisationSite.and.returnValue(
  //       of({})
  //     );
  //     await wrapperConfigServiceSpy.getCountryDetails.and.returnValue(
  //       of(countryDetails)
  //     );

  //     component.ngOnInit();

  //     expect(wrapperConfigServiceSpy.getCountryDetails).toHaveBeenCalled();
  //     expect(component.countryDetails).toEqual(countryDetails);
  //   });
  // });

  // describe('onSubmit', () => {
  //   it('should call updateOrganisationSite when isEdit is true', () => {
  //     const siteInfo = {
  //       siteName: 'Test Site',
  //       address: {
  //         streetAddress: '123 Test Street',
  //         locality: 'Test Locality',
  //         region: 'Test Region',
  //         postalCode: '12345',
  //         countryCode: 'US',
  //       },
  //     };
  //     component.isEdit = true;
  //     component.formGroup.setValue(siteInfo);
  //     wrapperOrgSiteServiceSpy.updateOrganisationSite.and.returnValue(of({}));

  //     component.onSubmit(component.formGroup);

  //     expect(
  //       wrapperOrgSiteServiceSpy.updateOrganisationSite
  //     ).toHaveBeenCalledWith(
  //       component.organisationId,
  //       component.siteId,
  //       siteInfo
  //     );
  //     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
  //       'manage-org/profile/contact-operation-success/UpdateSite'
  //     );
  //     expect(component.submitted).toBeFalse();
  //   });

  //   it('should call createOrganisationSite when isEdit is false', () => {
  //     const siteInfo = {
  //       siteName: 'Test Site',
  //       address: {
  //         streetAddress: '123 Test Street',
  //         locality: 'Test Locality',
  //         region: 'Test Region',
  //         postalCode: '12345',
  //         countryCode: 'US',
  //       },
  //     };
  //     component.isEdit = false;
  //     component.formGroup.setValue(siteInfo);
  //     wrapperOrgSiteServiceSpy.createOrganisationSite.and.returnValue(of(123));

  //     component.onSubmit(component.formGroup);

  //     expect(
  //       wrapperOrgSiteServiceSpy.createOrganisationSite
  //     ).toHaveBeenCalledWith(component.organisationId, siteInfo);
  //     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
  //       'manage-org/profile/site/add-contact-to-site?data={"isEdit":false,"siteId":123}'
  //     );
  //     expect(component.submitted).toBeFalse();
  //   });
  // });

  // describe('formValid', () => {
  //   it('should return true when form is valid', () => {
  //     component.formGroup.setValue({
  //       name: 'Test Site',
  //       streetAddress: '123 Test Street',
  //       locality: 'Test Locality',
  //       region: 'Test Region',
  //       postalCode: '12345',
  //       countryCode: 'US',
  //     });

  //     const result = component.formValid(component.formGroup);

  //     expect(result).toBeTrue();
  //   });

  //   it('should return false when form is invalid', () => {
  //     component.formGroup.setValue({
  //       name: '',
  //       streetAddress: '123 Test Street',
  //       locality: 'Test Locality',
  //       region: 'Test Region',
  //       postalCode: '12345',
  //       countryCode: 'US',
  //     });

  //     const result = component.formValid(component.formGroup);

  //     expect(result).toBeFalse();
  //   });
  // });

  // describe('onCancelClick', () => {
  //   it('should navigate to manage-org/profile', () => {
  //     component.onCancelClick();

  //     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
  //       'manage-org/profile'
  //     );
  //   });
  // });

  // describe('onDeleteClick', () => {
  //   it('should navigate to manage-org/profile/site/delete', () => {
  //     const data = {
  //       organisationId: component.organisationId,
  //       siteId: component.siteId,
  //     };

  //     component.onDeleteClick();

  //     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
  //       'manage-org/profile/site/delete?data=' + JSON.stringify(data)
  //     );
  //   });
  // });

  // describe('onContactAddClick', () => {
  //   it('should navigate to manage-org/profile/site/contact-edit', () => {
  //     const data = {
  //       isEdit: false,
  //       contactId: 0,
  //       siteId: component.siteId,
  //       siteCreate: false,
  //       ContactAdd: true,
  //     };

  //     component.onContactAddClick();

  //     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
  //       'manage-org/profile/site/contact-edit?data=' + JSON.stringify(data)
  //     );
  //   });
  // });

  // describe('onContactEditClick', () => {
  //   it('should navigate to manage-org/profile/site/contact-edit', () => {
  //     const contactInfo = { contactId: 123 };
  //     const data = {
  //       isEdit: true,
  //       contactId: contactInfo.contactId,
  //       siteId: component.siteId,
  //     };

  //     component.onContactEditClick(contactInfo);

  //     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
  //       'manage-org/profile/site/contact-edit?data=' + JSON.stringify(data)
  //     );
  //   });
  // });
});
