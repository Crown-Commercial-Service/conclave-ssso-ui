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

  it('should creat', () => {
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
      const spy1 = jest.spyOn(component, 'checkValidOrganisation');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
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
      const spy1 = jest.spyOn(component, 'initializer');
      const spy2 = jest.spyOn(wrapperUserDelegatedServiceStub,'getDeligatedOrg');
      const spy3 = jest.spyOn(manageDelegateServiceStub, 'setDelegatedOrg');
      component.checkValidOrganisation();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
    });
  });

  describe('initializer', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const spy1 = jest.spyOn(component, 'loadActivities');
      const spy2 = jest.spyOn(component, 'loadServices');
      const spy3 = jest.spyOn(component, 'getDelegatedOrganisation');
      const spy4 = jest.spyOn(component, 'GetOrgDetails');
      const spy5 = jest.spyOn(authServiceStub, 'getPermissions');
      const spy6 = jest.spyOn(authServiceStub, 'getCcsServices');
      component.initializer();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
      expect(spy5).toHaveBeenCalled();
      expect(spy6).toHaveBeenCalled();
    });
  });

  describe('loadServices', () => {
    it('makes expected calls', () => {
      const spy1 = jest.spyOn(component, 'checkService');
      component.loadServices();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('getDelegatedOrganisation', () => {
    it('makes expected calls', () => {
      const wrapperUserDelegatedServiceStub: WrapperUserDelegatedService = fixture.debugElement.injector.get(
        WrapperUserDelegatedService
      );
      const spy1 = jest.spyOn(wrapperUserDelegatedServiceStub,'getDeligatedOrg');
      component.getDelegatedOrganisation();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('GetOrgDetails', () => {
    it('makes expected calls', () => {
      const ciiServiceStub: ciiService = fixture.debugElement.injector.get(
        ciiService
      );
      const spy1 = jest.spyOn(ciiServiceStub, 'getOrgDetails');
      component.GetOrgDetails();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
