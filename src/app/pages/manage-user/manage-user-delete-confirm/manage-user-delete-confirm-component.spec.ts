import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageUserDeleteConfirmComponent } from './manage-user-delete-confirm-component';

describe('ManageUserDeleteConfirmComponent', () => {
  let component: ManageUserDeleteConfirmComponent;
  let fixture: ComponentFixture<ManageUserDeleteConfirmComponent>;

  beforeEach(() => {
    const storeStub = () => ({});
    const activatedRouteStub = () => ({});
    const routerStub = () => ({ navigateByUrl: (arg: any) => ({}) });
    const wrapperUserServiceStub = () => ({
      deleteUser: (userName: any) => ({ subscribe: (f: any) => f({}) })
    });
    const scrollHelperStub = () => ({});
    const viewportScrollerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ManageUserDeleteConfirmComponent],
      providers: [
        { provide: Store, useFactory: storeStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: WrapperUserService, useFactory: wrapperUserServiceStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub }
      ]
    });
    fixture = TestBed.createComponent(ManageUserDeleteConfirmComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onDeleteConfirmClick', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const wrapperUserServiceStub: WrapperUserService = fixture.debugElement.injector.get(
        WrapperUserService
      );
      const spy1 = jest.spyOn(routerStub, 'navigateByUrl');
      const spy2 = jest.spyOn(wrapperUserServiceStub, 'deleteUser');
      component.onDeleteConfirmClick();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });
});
