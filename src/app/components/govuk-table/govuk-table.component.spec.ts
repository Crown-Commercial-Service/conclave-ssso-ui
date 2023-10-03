import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { PaginationService } from 'src/app/shared/pagination.service';
import { HelperService } from 'src/app/shared/helper.service';
import { FormsModule } from '@angular/forms';
import { GovUKTableComponent } from './govuk-table.component';
import { environment } from 'src/environments/environment';

describe('GovUKTableComponent', () => {
  let component: GovUKTableComponent;
  let fixture: ComponentFixture<GovUKTableComponent>;

  beforeEach(() => {
    const viewportScrollerStub = () => ({});
    const storeStub = () => ({});
    const scrollHelperStub = () => ({});
    const paginationServiceStub = () => ({
      getVisibleDots: (currentPage: any, pageCount: any) => ({})
    });
    const helperServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [GovUKTableComponent],
      providers: [
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: Store, useFactory: storeStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: PaginationService, useFactory: paginationServiceStub },
        { provide: HelperService, useFactory: helperServiceStub }
      ]
    });
    fixture = TestBed.createComponent(GovUKTableComponent);
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

  it(`selectedRadioId has default value`, () => {
    expect(component.selectedRadioId).toEqual(`table-radio-id-non`);
  });

  it(`maxVisibleDots has default value`, () => {
    expect(component.maxVisibleDots).toEqual(5);
  });

  describe('getPaginationData', () => {
    it('makes expected calls', () => {
      const paginationServiceStub: PaginationService = fixture.debugElement.injector.get(
        PaginationService
      );
      const spy1 = jest.spyOn(paginationServiceStub, 'getVisibleDots');
      component.getPaginationData();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
