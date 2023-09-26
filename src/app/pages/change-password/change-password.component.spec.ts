import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { environment } from 'src/environments/environment';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async () => {
    const authServiceStub = () => ({
      changePassword: (contactData: any) => ({
        toPromise: () => ({ then: () => ({}) })
      }),
      signOut: () => ({})
    });
    const scrollHelperStub = () => ({
      doScroll: () => ({}),
      scrollToFirst: (string: string) => ({})
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ChangePasswordComponent],
      providers: [
        { provide: FormBuilder },
        { provide: Router },
        { provide: Store },
        { provide: Location },
        { provide: ViewportScroller },
        { provide: AuthService, useFactory: authServiceStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`submitted has default value`, () => {
    expect(component.submitted).toEqual(false);
  });

  it(`usedPasswordThreshold has default value`, () => {
    expect(component.usedPasswordThreshold).toEqual(
      environment.usedPasswordThreshold
    );
  });

  it(`isOrgAdmin has default value`, () => {
    expect(component.isOrgAdmin).toEqual(false);
  });

  describe('checkPasswords', () => {
    it('makes expected calls', () => {
      const formGroupStub: FormGroup = <any>{};
      const spy1 = spyOn(formGroupStub, 'get');
      (<jasmine.Spy>component.checkPasswords).and.callThrough();
      component.checkPasswords(formGroupStub);
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('makes expected calls', () => {
      const formGroupStub: FormGroup = <any>{};
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const scrollHelperStub: ScrollHelper = fixture.debugElement.injector.get(
        ScrollHelper
      );
      const spy1 = jest.spyOn(component, 'formValid');
      const spy2 = jest.spyOn(formGroupStub, 'get');
      const spy3 = jest.spyOn(routerStub, 'navigateByUrl');
      const spy4 = jest.spyOn(authServiceStub, 'changePassword');
      const spy5 = jest.spyOn(authServiceStub, 'signOut');
      const spy6 = jest.spyOn(scrollHelperStub, 'scrollToFirst');
      component.onSubmit(formGroupStub);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
      expect(spy5).toHaveBeenCalled();
      expect(spy6).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewChecked', () => {
    it('makes expected calls', () => {
      const scrollHelperStub: ScrollHelper = fixture.debugElement.injector.get(
        ScrollHelper
      );
      const spy1 = jest.spyOn(scrollHelperStub, 'doScroll');
      component.ngAfterViewChecked();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('onCancelClick', () => {
    it('makes expected calls', () => {
      const locationStub = { back: () => ({}) };
      const spy1 = jest.spyOn(locationStub, 'back');
      component.onCancelClick();
      expect(spy1).toHaveBeenCalled();
    });
  });

});
