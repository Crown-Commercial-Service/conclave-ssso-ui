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
  let routerStub: any;

  beforeEach(() => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);
    routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) },
    });
    const storeStub = () => ({});
    const authServiceStub = () => ({
      token: (arg: any) => ({ toPromise: () => ({ then: () => ({}) }) }),
      publishAuthStatus: (arg: any) => ({}),
      createSession: (refresh_token: any) => ({
        toPromise: () => ({ then: () => ({}) }),
      }),
      registerTokenRenewal: () => ({}),
      logOutAndRedirect: () => ({}),
    });
    const tokenServiceStub = () => ({
      getDecodedToken: (id_token: any) => ({
        email: {},
        ciiOrgId: {},
        exp: {},
      }),
    });
    const workerServiceStub = () => ({
      storeTokenInWorker: (tokenInfo: any) => ({}),
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AuthSuccessComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: Store, useFactory: storeStub },
        { provide: AuthService, useFactory: authServiceStub },
        { provide: TokenService, useFactory: tokenServiceStub },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
        { provide: WorkerService, useFactory: workerServiceStub },
      ],
    });

    fixture = TestBed.createComponent(AuthSuccessComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
