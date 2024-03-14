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
import { TranslateModule } from '@ngx-translate/core';
import { BuyerSearchComponent } from './search.component';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

describe('BuyerSearchComponent', () => {
  let component: BuyerSearchComponent;
  let fixture: ComponentFixture<BuyerSearchComponent>;

  beforeEach(() => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    const changeDetectorRefStub = () => ({});
    const formBuilderStub = () => ({ group: (object: any) => ({}) });
    const storeStub = () => ({});
    const routerStub = () => ({ navigateByUrl: (arg: any) => ({}) });
    const organisationServiceStub = () => ({
      get: (searchText: any, currentPage: any, pageSize: any) => ({
        toPromise: () => ({}),
      }),
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BuyerSearchComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Store, useFactory: storeStub },
        { provide: Router, useFactory: routerStub },
        { provide: OrganisationService, useFactory: organisationServiceStub },
        { provide: ScrollHelper, useValue: {} },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
      ],
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

  describe('onSearch', () => {
    it('makes expected calls', () => {
      const organisationServiceStub: OrganisationService =
        TestBed.inject(OrganisationService);
      const spy1 = spyOn(organisationServiceStub, 'get').and.returnValue(
        of({})
      );
      component.onSearch();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('onContinueClick', () => {
    it('makes expected calls', () => {
      const routerStub: Router = TestBed.inject(Router);
      const spy1 = spyOn(routerStub, 'navigateByUrl');
      component.onContinueClick();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('onCancelClick', () => {
    it('makes expected calls', () => {
      const routerStub: Router = TestBed.inject(Router);
      const spy1 = spyOn(routerStub, 'navigateByUrl');
      component.onCancelClick();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
