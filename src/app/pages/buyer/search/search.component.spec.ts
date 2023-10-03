import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { BuyerSearchComponent } from './search.component';
import { environment } from 'src/environments/environment';

describe('BuyerSearchComponent', () => {
  let component: BuyerSearchComponent;
  let fixture: ComponentFixture<BuyerSearchComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const formBuilderStub = () => ({ group: (object: any) => ({}) });
    const storeStub = () => ({});
    const routerStub = () => ({ navigateByUrl: (arg: any) => ({}) });
    const organisationServiceStub = () => ({
      get: (searchText: any, currentPage: any, pageSize: any) => ({ toPromise: () => ({}) })
    });
    const scrollHelperStub = () => ({});
    const viewportScrollerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BuyerSearchComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Store, useFactory: storeStub },
        { provide: Router, useFactory: routerStub },
        { provide: OrganisationService, useFactory: organisationServiceStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub }
      ]
    });
    fixture = TestBed.createComponent(BuyerSearchComponent);
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

  it(`currentPage has default value`, () => {
    expect(component.currentPage).toEqual(1);
  });

  it(`pageCount has default value`, () => {
    expect(component.pageCount).toEqual(0);
  });

  it(`pageSize has default value`, () => {
    expect(component.pageSize).toEqual(environment.listPageSize);
  });

  it(`tableHeaders has default value`, () => {
    expect(component.tableHeaders).toEqual([`ORGANISATION`]);
  });

  it(`tableColumnsToDisplay has default value`, () => {
    expect(component.tableColumnsToDisplay).toEqual([`legalName`]);
  });

  it(`searchSumbited has default value`, () => {
    expect(component.searchSumbited).toEqual(false);
  });

  describe('onSearch', () => {
    it('makes expected calls', () => {
      const organisationServiceStub: OrganisationService = fixture.debugElement.injector.get(
        OrganisationService
      );
      const spy1 = jest.spyOn(organisationServiceStub, 'get');
      component.onSearch();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('onContinueClick', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const spy1 = jest.spyOn(routerStub, 'navigateByUrl');
      component.onContinueClick();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('onCancelClick', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const spy1 = jest.spyOn(routerStub, 'navigateByUrl');
      component.onCancelClick();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
