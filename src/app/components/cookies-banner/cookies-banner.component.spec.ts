import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CookiesService } from 'src/app/shared/cookies.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CookiesBannerComponent } from './cookies-banner.component';

describe('CookiesBannerComponent', () => {
  let component: CookiesBannerComponent;
  let fixture: ComponentFixture<CookiesBannerComponent>;

  beforeEach(() => {
    const cookiesServiceStub = () => ({
      setSessionCookie: (f: any, string: any, cookieExpirationTimeInMinutes: any) => ({}),
      deleteSessionCookie: (f: any, string: any) => ({}),
      getCookie: (string: any) => ({}),
      deleteAdditionalCookies: () => ({}),
      deleteGlassBoxCookies: () => ({}),
      setCookie: (string: any, string1: any, cookieExpirationTimeInMinutes: any) => ({})
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CookiesBannerComponent],
      providers: [{ provide: CookiesService, useFactory: cookiesServiceStub }]
    });
    fixture = TestBed.createComponent(CookiesBannerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`initDeleteCookieeArray has default value`, () => {
    expect(component.initDeleteCookieeArray).toEqual([
      `_gid`,
      `_ga`,
      `_gat_UA`,
      `_ga_624NHLKTKL`,
      `_cls_v`,
      `_cls_s`
    ]);
  });

  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      const spy1 = jest.spyOn(component, 'initializerCookies');
      component.ngAfterViewInit();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const cookiesServiceStub: CookiesService = fixture.debugElement.injector.get(
        CookiesService
      );
      const spy1 = jest.spyOn(cookiesServiceStub, 'setSessionCookie');
      const spy2 = jest.spyOn(cookiesServiceStub, 'deleteSessionCookie');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('initializerCookies', () => {
    it('makes expected calls', () => {
      const cookiesServiceStub: CookiesService = fixture.debugElement.injector.get(
        CookiesService
      );
      const spy1 = jest.spyOn(cookiesServiceStub, 'getCookie');
      const spy2 = jest.spyOn(cookiesServiceStub, 'deleteAdditionalCookies');
      const spy3 = jest.spyOn(cookiesServiceStub, 'deleteGlassBoxCookies');
      const spy4 = jest.spyOn(cookiesServiceStub, 'setCookie');
      component.initializerCookies();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
    });
  });
});
