import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { PatternService } from 'src/app/shared/pattern.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NominateComponent } from './nominate.component';

describe('NominateComponent', () => {
  let component: NominateComponent;
  let fixture: ComponentFixture<NominateComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: (object: any) => ({}) });
    const storeStub = () => ({});
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) }
    });
    const routerStub = () => ({ navigateByUrl: (arg: any) => ({}) });
    const authServiceStub = () => ({
      nominate: (uname: any) => ({ toPromise: () => ({ then: () => ({}) }) })
    });
    const scrollHelperStub = () => ({});
    const viewportScrollerStub = () => ({});
    const patternServiceStub = () => ({
      NameValidator: {},
      emailPattern: {},
      emailValidator: (value: any) => ({})
    });
    const sharedDataServiceStub = () => ({ NominiData: { next: () => ({}) } });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [NominateComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Store, useFactory: storeStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: AuthService, useFactory: authServiceStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: PatternService, useFactory: patternServiceStub },
        { provide: SharedDataService, useFactory: sharedDataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(NominateComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`submitted has default value`, () => {
    expect(component.submitted).toEqual(false);
  });

  describe('onSubmit', () => {
    it('makes expected calls', () => {
      const formGroupStub: FormGroup = <any>{};
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const patternServiceStub: PatternService = fixture.debugElement.injector.get(
        PatternService
      );
      const spy1 = jest.spyOn(component, 'formValid');
      const spy2 = jest.spyOn(formGroupStub, 'get');
      const spy3 = jest.spyOn(routerStub, 'navigateByUrl');
      const spy4 = jest.spyOn(authServiceStub, 'nominate');
      const spy5 = jest.spyOn(patternServiceStub, 'emailValidator');
      component.onSubmit(formGroupStub);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
      expect(spy5).toHaveBeenCalled();
    });
  });

  describe('goConfirmOrgPage', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const spy1 = jest.spyOn(routerStub, 'navigateByUrl');
      component.goConfirmOrgPage();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
