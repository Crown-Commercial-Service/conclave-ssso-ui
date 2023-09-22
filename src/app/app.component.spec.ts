import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { LoadingIndicatorService } from './services/helper/loading-indicator.service';
import { GlobalRouteService } from './services/helper/global-route.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import * as reducers from './store/ui.reducers';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const storeStub = () => ({ pipe: () => ({}), dispatch: () => ({}) });
    const overlayContainerStub = () => ({
      getContainerElement: () => ({
        classList: { add: () => ({}), remove: () => ({}) }
      })
    });
    const translateServiceStub = () => ({ setDefaultLang: () => ({}) });
    const activatedRouteStub = () => ({
      firstChild: { firstChild: {}, snapshot: { data: {} } }
    });
    const routerStub = () => ({
      events: {
        pipe: () => ({ subscribe: () => {} }),
        subscribe: () => {}
      },
      navigate: (array: Array<any>, object: any) => ({})
    });
    const authServiceStub = () => ({
      isUserAuthenticated: () => ({}),
      isInMemoryTokenExists: () => ({}),
      registerTokenRenewal: () => ({}),
      logOutAndRedirect: () => ({})
    });
    const domSanitizerStub = () => ({});
    const titleStub = () => ({ setTitle: () => ({}) });
    const loadingIndicatorServiceStub = () => ({});
    const globalRouteServiceStub = () => ({ globalRoute: {} });
    const googleTagManagerServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('ui-state', reducers.reducer),
        RouterTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppComponent],
      providers: [
        { provide: Store, useFactory: storeStub },
        { provide: OverlayContainer, useFactory: overlayContainerStub },
        { provide: TranslateService, useFactory: translateServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: AuthService, useFactory: authServiceStub },
        { provide: DomSanitizer, useFactory: domSanitizerStub },
        { provide: Title, useFactory: titleStub },
        {
          provide: LoadingIndicatorService,
          useFactory: loadingIndicatorServiceStub
        },
        { provide: GlobalRouteService, useFactory: globalRouteServiceStub },
        {
          provide: GoogleTagManagerService,
          useFactory: googleTagManagerServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('It is created', () => {
    expect(component).toBeTruthy();
  });

  it(`home has default value`, () => {
    expect(component.home).toEqual(environment.uri.ccsDashboardUrl);
  });

  it(`isAuthenticated has default value`, () => {
    expect(component.isAuthenticated).toEqual(false);
  });

  it(`ccsContactUrl has default value`, () => {
    expect(component.ccsContactUrl).toEqual(environment.uri.ccsContactUrl);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const overlayContainerStub: OverlayContainer = fixture.debugElement.injector.get(
        OverlayContainer
      );
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(overlayContainerStub, 'getContainerElement').and.callThrough();
      spyOn(routerStub, 'navigate').and.callThrough();
      spyOn(authServiceStub, 'isUserAuthenticated').and.callThrough();
      spyOn(authServiceStub, 'isInMemoryTokenExists').and.callThrough();
      spyOn(authServiceStub, 'registerTokenRenewal').and.callThrough();
      component.ngOnInit();
      expect(overlayContainerStub.getContainerElement).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(authServiceStub.isUserAuthenticated).toHaveBeenCalled();
      expect(authServiceStub.isInMemoryTokenExists).toHaveBeenCalled();
      expect(authServiceStub.registerTokenRenewal).toHaveBeenCalled();
    });
  });

  describe('onToggle', () => {
    it('makes expected calls', () => {
      const storeStub: Store = fixture.debugElement.injector.get(Store);
      spyOn(storeStub, 'dispatch').and.callThrough();
      component.onToggle();
      expect(storeStub.dispatch).toHaveBeenCalled();
    });
  });

  describe('signoutAndRedirect', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'logOutAndRedirect').and.callThrough();
      component.signoutAndRedirect();
      expect(authServiceStub.logOutAndRedirect).toHaveBeenCalled();
    });
  });
});
