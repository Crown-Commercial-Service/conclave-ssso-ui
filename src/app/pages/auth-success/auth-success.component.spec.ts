import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WorkerService } from 'src/app/services/worker.service';
import { AuthSuccessComponent } from './auth-success.component';

describe('AuthSuccessComponent', () => {
  let component: AuthSuccessComponent;
  let fixture: ComponentFixture<AuthSuccessComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) }
    });
    const routerStub = () => ({ navigateByUrl: (previousGlobalRoute: any) => ({}) });
    const storeStub = () => ({});
    const authServiceStub = () => ({
      token: (arg: any) => ({ toPromise: () => ({ then: () => ({}) }) }),
      publishAuthStatus: (arg: any) => ({}),
      createSession: (refresh_token: any) => ({
        toPromise: () => ({ then: () => ({}) })
      }),
      registerTokenRenewal: () => ({}),
      logOutAndRedirect: () => ({})
    });
    const tokenServiceStub = () => ({
      getDecodedToken: (id_token: any) => ({ email: {}, ciiOrgId: {}, exp: {} })
    });
    const viewportScrollerStub = () => ({});
    const scrollHelperStub = () => ({});
    const workerServiceStub = () => ({ storeTokenInWorker: (tokenInfo: any) => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AuthSuccessComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: Store, useFactory: storeStub },
        { provide: AuthService, useFactory: authServiceStub },
        { provide: TokenService, useFactory: tokenServiceStub },
        { provide: ViewportScroller, useFactory: viewportScrollerStub },
        { provide: ScrollHelper, useFactory: scrollHelperStub },
        { provide: WorkerService, useFactory: workerServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AuthSuccessComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const tokenServiceStub: TokenService = fixture.debugElement.injector.get(
        TokenService
      );
      const workerServiceStub: WorkerService = fixture.debugElement.injector.get(
        WorkerService
      );
      const spy1 = jest.spyOn(routerStub, 'navigateByUrl');
      const spy2 = jest.spyOn(authServiceStub, 'token');
      const spy3 = jest.spyOn(authServiceStub, 'publishAuthStatus');
      const spy4 = jest.spyOn(authServiceStub, 'createSession');
      const spy5 = jest.spyOn(authServiceStub, 'registerTokenRenewal');
      const spy6 = jest.spyOn(authServiceStub, 'logOutAndRedirect');
      const spy7 = jest.spyOn(tokenServiceStub, 'getDecodedToken');
      const spy8 = jest.spyOn(workerServiceStub, 'storeTokenInWorker');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
      expect(spy5).toHaveBeenCalled();
      expect(spy6).toHaveBeenCalled();
      expect(spy7).toHaveBeenCalled();
      expect(spy8).toHaveBeenCalled();
    });
  });
});
