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
import { UpdateOrgServiceComponent } from './update-org-service.component';
import { environment } from 'src/environments/environment';

describe('UpdateOrgServiceComponent', () => {
  let component: UpdateOrgServiceComponent;
  let fixture: ComponentFixture<UpdateOrgServiceComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: (object: any) => ({}) });
    const storeStub = () => ({});
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) }
    });
    const routerStub = () => ({ navigateByUrl: (arg: any) => ({}) });
    const organisationServiceStub = () => ({
      getById: (id: any) => ({ pipe: () => ({}) })
    });
    const wrapperOrganisationGroupServiceStub = () => ({
      getGroupOrganisationRoles: (ciiOrganisationId: any) => ({ pipe: () => ({}) })
    });
    const wrapperConfigurationServiceStub = () => ({
      getRoles: () => ({ pipe: () => ({}) })
    });
    const scrollHelperStub = () => ({});
    const viewportScrollerStub = () => ({});
    const wrapperOrganisationServiceStub = () => ({
      getAutoValidationStatus: (ciiOrganisationId: any) => ({
        toPromise: () => ({ then: () => ({ catch: () => ({}) }) })
      })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UpdateOrgServiceComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Store, useFactory: storeStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: OrganisationService, useFactory: organisationServiceStub },
        {
          provide: WrapperOrganisationGroupService,
          useFactory: wrapperOrganisationGroupServiceStub
        },
        {
          provide: WrapperConfigurationService,
          useFactory: wrapperConfigurationServiceStub
        },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        {
          provide: WrapperOrganisationService,
          useFactory: wrapperOrganisationServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(UpdateOrgServiceComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`showRoleView has default value`, () => {
    expect(component.showRoleView).toEqual(
      environment.appSetting.hideSimplifyRole
    );
  });

  it(`buyerRemoveList has default value`, () => {
    expect(component.buyerRemoveList).toEqual([
      `EL_JNR_SUPPLIER`,
      `EL_SNR_SUPPLIER`,
      `JAEGGER_SUPPLIER`
    ]);
  });

  it(`supplierRemoveList has default value`, () => {
    expect(component.supplierRemoveList).toEqual([
      `JAEGGER_BUYER`,
      `CAT_USER`,
      `FP_USER`
    ]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const organisationServiceStub: OrganisationService = fixture.debugElement.injector.get(
        OrganisationService
      );
      const spy1 = jest.spyOn(organisationServiceStub, 'getById');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
