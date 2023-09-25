import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { TokenService } from '../../services/auth/token.service';
import { AuthService } from '../../services/auth/auth.service';
import { ScrollHelper } from '../../services/helper/scroll-helper.services';
import { ciiService } from '../../services/cii/cii.service';
import { WrapperUserDelegatedService } from '../../services/wrapper/wrapper-user-delegated.service';
import { ManageDelegateService } from '../manage-delegated/service/manage-delegate.service';
import { HomeComponent } from './home.component';
import { environment } from '../../../environments/environment';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    const storeStub = () => ({});
    const tokenServiceStub = () => ({});
    const authServiceStub = () => ({
      getPermissions: () => ({ toPromise: () => ({ then: () => ({}) }) }),
      getCcsServices: () => ({ toPromise: () => ({ then: () => ({}) }) })
    });
    const domSanitizerStub = () => ({});
    const scrollHelperStub = () => ({});
    const viewportScrollerStub = () => ({});
    const ciiServiceStub = () => ({
      getOrgDetails: () => ({
        toPromise: () => ({ then: () => ({ catch: () => ({}) }) })
      })
    });
    const wrapperUserDelegatedServiceStub = () => ({
      getDeligatedOrg: () => ({ subscribe: () => {} })
    });
    const manageDelegateServiceStub = () => ({
      setDelegatedOrg: (number: any, string: any) => ({})
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HomeComponent],
      providers: [
        { provide: Store, useFactory: storeStub },
        { provide: TokenService, useFactory: tokenServiceStub },
        { provide: AuthService, useFactory: authServiceStub },
        { provide: DomSanitizer, useFactory: domSanitizerStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: ciiService, useFactory: ciiServiceStub },
        {
          provide: WrapperUserDelegatedService,
          useFactory: wrapperUserDelegatedServiceStub
        },
        {
          provide: ManageDelegateService,
          useFactory: manageDelegateServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('It is created', () => {
    expect(component).toBeTruthy();
  });

  it(`systemModules has default value`, () => {
    expect(component.systemModules).toEqual([]);
  });

  it(`ccsModules has default value`, () => {
    expect(component.ccsModules).toEqual([]);
  });

  it(`otherModules has default value`, () => {
    expect(component.otherModules).toEqual([]);
  });

  it(`ccsServices has default value`, () => {
    expect(component.ccsServices).toEqual([]);
  });

  it(`servicePermissions has default value`, () => {
    expect(component.servicePermissions).toEqual([]);
  });

  it(`idam_client_id has default value`, () => {
    expect(component.idam_client_id).toEqual(environment.idam_client_id);
  });

  it(`targetURL has default value`, () => {
    expect(component.targetURL).toEqual(environment.uri.api.security);
  });

  it(`isOrgAdmin has default value`, () => {
    expect(component.isOrgAdmin).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'checkValidOrganisation').and.callThrough();
      component.ngOnInit();
      expect(component.checkValidOrganisation).toHaveBeenCalled();
    });
  });

  describe('checkValidOrganisation', () => {
    it('makes expected calls', () => {
      const wrapperUserDelegatedServiceStub: WrapperUserDelegatedService = fixture.debugElement.injector.get(
        WrapperUserDelegatedService
      );
      const manageDelegateServiceStub: ManageDelegateService = fixture.debugElement.injector.get(
        ManageDelegateService
      );
      spyOn(component, 'initializer').and.callThrough();
      spyOn(
        wrapperUserDelegatedServiceStub,
        'getDeligatedOrg'
      ).and.callThrough();
      spyOn(manageDelegateServiceStub, 'setDelegatedOrg').and.callThrough();
      component.checkValidOrganisation();
      expect(component.initializer).toHaveBeenCalled();
      expect(
        wrapperUserDelegatedServiceStub.getDeligatedOrg
      ).toHaveBeenCalled();
      expect(manageDelegateServiceStub.setDelegatedOrg).toHaveBeenCalled();
    });
  });

  describe('initializer', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(component, 'loadActivities').and.callThrough();
      spyOn(component, 'loadServices').and.callThrough();
      spyOn(component, 'getDelegatedOrganisation').and.callThrough();
      spyOn(component, 'GetOrgDetails').and.callThrough();
      spyOn(authServiceStub, 'getPermissions').and.callThrough();
      spyOn(authServiceStub, 'getCcsServices').and.callThrough();
      component.initializer();
      expect(component.loadActivities).toHaveBeenCalled();
      expect(component.loadServices).toHaveBeenCalled();
      expect(component.getDelegatedOrganisation).toHaveBeenCalled();
      expect(component.GetOrgDetails).toHaveBeenCalled();
      expect(authServiceStub.getPermissions).toHaveBeenCalled();
      expect(authServiceStub.getCcsServices).toHaveBeenCalled();
    });
  });

  describe('loadServices', () => {
    it('makes expected calls', () => {
      spyOn(component, 'checkService').and.callThrough();
      component.loadServices();
      expect(component.checkService).toHaveBeenCalled();
    });
  });

  describe('getDelegatedOrganisation', () => {
    it('makes expected calls', () => {
      const wrapperUserDelegatedServiceStub: WrapperUserDelegatedService = fixture.debugElement.injector.get(
        WrapperUserDelegatedService
      );
      spyOn(
        wrapperUserDelegatedServiceStub,
        'getDeligatedOrg'
      ).and.callThrough();
      component.getDelegatedOrganisation();
      expect(
        wrapperUserDelegatedServiceStub.getDeligatedOrg
      ).toHaveBeenCalled();
    });
  });

  describe('GetOrgDetails', () => {
    it('makes expected calls', () => {
      const ciiServiceStub: ciiService = fixture.debugElement.injector.get(
        ciiService
      );
      spyOn(ciiServiceStub, 'getOrgDetails').and.callThrough();
      component.GetOrgDetails();
      expect(ciiServiceStub.getOrgDetails).toHaveBeenCalled();
    });
  });
});
