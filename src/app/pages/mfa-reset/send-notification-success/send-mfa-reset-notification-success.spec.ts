import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SendMFAResetNotificationSuccessComponent } from './send-mfa-reset-notification-success';

describe('SendMFAResetNotificationSuccessComponent', () => {
  let component: SendMFAResetNotificationSuccessComponent;
  let fixture: ComponentFixture<SendMFAResetNotificationSuccessComponent>;

  beforeEach(() => {
    const storeStub = () => ({});
    const scrollHelperStub = () => ({});
    const viewportScrollerStub = () => ({});
    const activatedRouteStub = () => ({});
    const authServiceStub = () => ({ logOutAndRedirect: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SendMFAResetNotificationSuccessComponent],
      providers: [
        { provide: Store, useFactory: storeStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: AuthService, useFactory: authServiceStub }
      ]
    });
    fixture = TestBed.createComponent(SendMFAResetNotificationSuccessComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onNavigateLinkClick', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const spy1 = jest.spyOn(authServiceStub, 'logOutAndRedirect');
      component.onNavigateLinkClick();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
