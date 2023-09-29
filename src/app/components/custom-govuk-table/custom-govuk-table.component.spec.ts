import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { HelperService } from 'src/app/shared/helper.service';
import { PaginationService } from 'src/app/shared/pagination.service';
import { CustomGovukTableComponent } from './custom-govuk-table.component';
import { environment } from 'src/environments/environment';

describe('CustomGovukTableComponent', () => {
  let component: CustomGovukTableComponent;
  let fixture: ComponentFixture<CustomGovukTableComponent>;

  beforeEach(() => {
    const viewportScrollerStub = () => ({});
    const storeStub = () => ({});
    const scrollHelperStub = () => ({});
    const helperServiceStub = () => ({});
    const paginationServiceStub = () => ({
      getVisibleDots: (currentPage: any, pageCount: any) => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CustomGovukTableComponent],
      providers: [
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: Store, useFactory: storeStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: HelperService, useFactory: helperServiceStub },
        { provide: PaginationService, useFactory: paginationServiceStub }
      ]
    });
    fixture = TestBed.createComponent(CustomGovukTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`currentPage has default value`, () => {
    expect(component.currentPage).toEqual(1);
  });

  it(`totalPagesArray has default value`, () => {
    expect(component.totalPagesArray).toEqual([]);
  });

  it(`pageSize has default value`, () => {
    expect(component.pageSize).toEqual(environment.listPageSize);
  });

  describe('getPaginationDataForCustom', () => {
    it('makes expected calls', () => {
      const paginationServiceStub: PaginationService = fixture.debugElement.injector.get(
        PaginationService
      );
      spyOn(paginationServiceStub, 'getVisibleDots').and.callThrough();
      component.getPaginationDataForCustom();
      expect(paginationServiceStub.getVisibleDots).toHaveBeenCalled();
    });
  });
});
