import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateOrgTypeComponent } from './update-org-type.component';

describe('UpdateOrgTypeComponent', () => {
  let component: UpdateOrgTypeComponent;
  let fixture: ComponentFixture<UpdateOrgTypeComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: (object: any) => ({}) });
    const storeStub = () => ({});
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) },
    });
    const routerStub = () => ({ navigateByUrl: (arg: any) => ({}) });
    const organisationServiceStub = () => ({
      getById: (id: any) => ({ pipe: () => ({}) }),
    });
    const wrapperOrganisationGroupServiceStub = () => ({
      getGroupOrganisationRoles: (ciiOrganisationId: any) => ({
        pipe: () => ({}),
      }),
    });
    const wrapperConfigurationServiceStub = () => ({
      getRoles: () => ({ pipe: () => ({}) }),
    });
    const scrollHelperStub = () => ({});
    const viewportScrollerStub = () => ({});
    const wrapperOrganisationServiceStub = () => ({
      getAutoValidationStatus: (ciiOrganisationId: any) => ({
        toPromise: () => ({ then: () => ({ catch: () => ({}) }) }),
      }),
    });

    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UpdateOrgTypeComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Store, useFactory: storeStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: OrganisationService, useFactory: organisationServiceStub },
        {
          provide: WrapperOrganisationGroupService,
          useFactory: wrapperOrganisationGroupServiceStub,
        },
        {
          provide: WrapperConfigurationService,
          useFactory: wrapperConfigurationServiceStub,
        },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        {
          provide: WrapperOrganisationService,
          useFactory: wrapperOrganisationServiceStub,
        },
      ],
    });

    fixture = TestBed.createComponent(UpdateOrgTypeComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`buyerRemoveList has default value`, () => {
    expect(component.buyerRemoveList).toEqual([
      `EL_JNR_SUPPLIER`,
      `EL_SNR_SUPPLIER`,
      `JAEGGER_SUPPLIER`,
    ]);
  });

  it(`supplierRemoveList has default value`, () => {
    expect(component.supplierRemoveList).toEqual([
      `JAEGGER_BUYER`,
      `ACCESS_CAAAC_CLIENT`,
      `CAT_USER`,
      `ACCESS_FP_CLIENT`,
      `FP_USER`,
    ]);
  });
});
