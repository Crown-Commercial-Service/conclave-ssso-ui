import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ciiService } from 'src/app/services/cii/cii.service';
import { FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CIIOptions } from './cii-options.component';

describe('CIIOptions', () => {
  let component: CIIOptions;
  let fixture: ComponentFixture<CIIOptions>;

  beforeEach(() => {
    const viewportScrollerStub = () => ({});
    const changeDetectorRefStub = () => ({});
    const routerStub = () => ({});
    const storeStub = () => ({});
    const scrollHelperStub = () => ({
      doScroll: () => ({}),
      scrollToFirst: (string: string) => ({})
    });
    const ciiServiceStub = () => ({ getSchemes: () => ({ pipe: () => ({}) }) });
    const formBuilderStub = () => ({ group: (object: any) => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CIIOptions],
      providers: [
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: Store, useFactory: storeStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ciiService, useFactory: ciiServiceStub },
        { provide: FormBuilder, useFactory: formBuilderStub }
      ]
    });
    fixture = TestBed.createComponent(CIIOptions);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`submitted has default value`, () => {
    expect(component.submitted).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const ciiServiceStub: ciiService = fixture.debugElement.injector.get(
        ciiService
      );
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(ciiServiceStub, 'getSchemes').and.callThrough();
      spyOn(formBuilderStub, 'group').and.callThrough();
      component.ngOnInit();
      expect(ciiServiceStub.getSchemes).toHaveBeenCalled();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewChecked', () => {
    it('makes expected calls', () => {
      const scrollHelperStub: ScrollHelper = fixture.debugElement.injector.get(
        ScrollHelper
      );
      spyOn(scrollHelperStub, 'doScroll').and.callThrough();
      component.ngAfterViewChecked();
      expect(scrollHelperStub.doScroll).toHaveBeenCalled();
    });
  });
});
