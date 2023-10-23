import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ManageOrganisationSiteEditComponent } from './manage-organisation-profile-site-edit.component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrganisationSiteEditComponent', () => {
  let component: ManageOrganisationSiteEditComponent;
  let fixture: ComponentFixture<ManageOrganisationSiteEditComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationSiteEditComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        MatSelectModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                data: JSON.stringify({ isEdit: true, siteId: 1 }),
              },
            },
          },
        },
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationSiteEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  //   it('should initialize the form with correct values when isEdit is true', () => {
  //     const mockSiteInfo = {
  //       siteName: 'Test Site',
  //       address: {
  //         streetAddress: '123 Test Street',
  //         locality: 'Test Locality',
  //         region: 'Test Region',
  //         postalCode: '12345',
  //         countryCode: 'US',
  //       },
  //     };
  //     spyOn(component.orgSiteService, 'getOrganisationSite').and.returnValue(
  //       of(mockSiteInfo)
  //     );

  //     component.ngOnInit();

  //     expect(component.formGroup.value.name).toEqual(mockSiteInfo.siteName);
  //     expect(component.formGroup.value.streetAddress).toEqual(
  //       mockSiteInfo.address.streetAddress
  //     );
  //     expect(component.formGroup.value.locality).toEqual(
  //       mockSiteInfo.address.locality
  //     );
  //     expect(component.formGroup.value.region).toEqual(
  //       mockSiteInfo.address.region
  //     );
  //     expect(component.formGroup.value.postalCode).toEqual(
  //       mockSiteInfo.address.postalCode
  //     );
  //     expect(component.formGroup.value.countryCode).toEqual(
  //       mockSiteInfo.address.countryCode
  //     );
  //   });

  //   it('should navigate to the correct URL when onSubmit is called', () => {
  //     spyOn(router, 'navigateByUrl');

  //     component.onSubmit(component.formGroup);

  //     expect(router.navigateByUrl).toHaveBeenCalledWith(
  //       'manage-org/profile/contact-operation-success/UpdateSite'
  //     );
  //   });

  //   it('should navigate to the correct URL when onCancelClick is called', () => {
  //     spyOn(router, 'navigateByUrl');

  //     component.onCancelClick();

  //     expect(router.navigateByUrl).toHaveBeenCalledWith('manage-org/profile');
  //   });
});
