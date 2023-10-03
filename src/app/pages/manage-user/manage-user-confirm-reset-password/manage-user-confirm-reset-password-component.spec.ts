import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageUserConfirmResetPasswordComponent } from './manage-user-confirm-reset-password-component';

describe('ManageUserConfirmResetPasswordComponent', () => {
  let component: ManageUserConfirmResetPasswordComponent;
  let fixture: ComponentFixture<ManageUserConfirmResetPasswordComponent>;

  beforeEach(() => {
    const storeStub = () => ({});
    const activatedRouteStub = () => ({});
    const routerStub = () => ({ navigateByUrl: (arg: any) => ({}) });
    const viewportScrollerStub = () => ({});
    const scrollHelperStub = () => ({});
    const wrapperUserServiceStub = () => ({
      resetUserPassword: (userName: any, string: any) => ({ subscribe: (f: any) => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ManageUserConfirmResetPasswordComponent],
      providers: [
        { provide: Store, useFactory: storeStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: WrapperUserService, useFactory: wrapperUserServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ManageUserConfirmResetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onConfirmClick', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const wrapperUserServiceStub: WrapperUserService = fixture.debugElement.injector.get(
        WrapperUserService
      );
      const spy1 = jest.spyOn(routerStub, 'navigateByUrl');
      const spy2 = jest.spyOn(wrapperUserServiceStub, 'resetUserPassword');
      component.onConfirmClick();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });
});
