import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { UserListInfo } from 'src/app/models/user';
import { Router } from '@angular/router';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { AuditLoggerService } from 'src/app/services/postgres/logger.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageUserProfilesComponent } from './manage-user-profiles-component';
import { environment } from 'src/environments/environment';

describe('ManageUserProfilesComponent', () => {
  let component: ManageUserProfilesComponent;
  let fixture: ComponentFixture<ManageUserProfilesComponent>;

  beforeEach(() => {
    const storeStub = () => ({});
    const viewportScrollerStub = () => ({});
    const routerStub = () => ({ navigateByUrl: (string: any) => ({}) });
    const scrollHelperStub = () => ({});
    const wrapperOrganisationServiceStub = () => ({
      getUsers: (organisationId: any, searchingUserName: any, currentPage: any, pageSize: any) => ({
        subscribe: (f: any) => f({})
      })
    });
    const auditLoggerServiceStub = () => ({
      createLog: (object: any) => ({ toPromise: () => ({}) })
    });
    const sharedDataServiceStub = () => ({ storeUserDetails: (arg: any) => ({}) });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ManageUserProfilesComponent],
      providers: [
        { provide: Store, useFactory: storeStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: Router, useFactory: routerStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        {
          provide: WrapperOrganisationService,
          useFactory: wrapperOrganisationServiceStub
        },
        { provide: AuditLoggerService, useFactory: auditLoggerServiceStub },
        { provide: SharedDataService, useFactory: sharedDataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ManageUserProfilesComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`currentPage has default value`, () => {
    expect(component.currentPage).toEqual(1);
  });

  it(`pageCount has default value`, () => {
    expect(component.pageCount).toEqual(0);
  });

  it(`pageSize has default value`, () => {
    expect(component.pageSize).toEqual(environment.listPageSize);
  });

  it(`usersTableHeaders has default value`, () => {
    expect(component.usersTableHeaders).toEqual([`NAME`, `EMAIL`]);
  });

  it(`usersColumnsToDisplay has default value`, () => {
    expect(component.usersColumnsToDisplay).toEqual([`name`, `userName`]);
  });

  it(`searchSumbited has default value`, () => {
    expect(component.searchSumbited).toEqual(false);
  });

  it(`isBulkUpload has default value`, () => {
    expect(component.isBulkUpload).toEqual(
      environment.appSetting.hideBulkupload
    );
  });

  describe('onEditRow', () => {
    it('makes expected calls', () => {
      const userListInfoStub: UserListInfo = <any>{};
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const sharedDataServiceStub: SharedDataService = fixture.debugElement.injector.get(
        SharedDataService
      );
      const spy1 = jest.spyOn(routerStub, 'navigateByUrl');
      const spy2 = jest.spyOn(sharedDataServiceStub, 'storeUserDetails');
      component.onEditRow(userListInfoStub);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const auditLoggerServiceStub: AuditLoggerService = fixture.debugElement.injector.get(
        AuditLoggerService
      );
      const spy1 = jest.spyOn(component, 'getOrganisationUsers');
      const spy2 = jest.spyOn(auditLoggerServiceStub, 'createLog');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('getOrganisationUsers', () => {
    it('makes expected calls', () => {
      const wrapperOrganisationServiceStub: WrapperOrganisationService = fixture.debugElement.injector.get(
        WrapperOrganisationService
      );
      const spy1 = jest.spyOn(wrapperOrganisationServiceStub, 'getUsers');
      component.getOrganisationUsers();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('onAddClick', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const spy1 = jest.spyOn(routerStub, 'navigateByUrl');
      component.onAddClick();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('onSearchClick', () => {
    it('makes expected calls', () => {
      const spy1 = jest.spyOn(component, 'getOrganisationUsers');
      component.onSearchClick();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
