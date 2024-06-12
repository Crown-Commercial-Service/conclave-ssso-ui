import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { GlobalRouteService } from 'src/app/services/helper/global-route.service';
import { AuthErrorComponent } from './auth-error.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthErrorComponent', () => {
  let component: AuthErrorComponent;
  let fixture: ComponentFixture<AuthErrorComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({});
    const storeStub = () => ({});
    const authServiceStub = () => ({ renewAccessToken: (arg: any) => ({}) });
    const globalRouteServiceStub = () => ({ globalRoute: 'home' });
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule],
      declarations: [AuthErrorComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Store, useFactory: storeStub },
        { provide: AuthService, useFactory: authServiceStub },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
        { provide: GlobalRouteService, useFactory: globalRouteServiceStub },
      ],
    });

    fixture = TestBed.createComponent(AuthErrorComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService =
        fixture.debugElement.injector.get(AuthService);
      spyOn(authServiceStub, 'renewAccessToken');
      component.ngOnInit();
      expect(authServiceStub.renewAccessToken).toHaveBeenCalled();
    });
  });
});
