import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookiesBannerComponent } from './cookies-banner.component';
import { CookiesService } from 'src/app/shared/cookies.service';

describe('CookiesBannerComponent', () => {
  let component: CookiesBannerComponent;
  let fixture: ComponentFixture<CookiesBannerComponent>;
  let cookiesService: CookiesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookiesBannerComponent],
      providers: [CookiesService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiesBannerComponent);
    component = fixture.componentInstance;
    cookiesService = TestBed.inject(CookiesService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cookies on ngOnInit', () => {
    spyOn(cookiesService, 'setSessionCookie');
    spyOn(cookiesService, 'deleteSessionCookie');
    component.ngOnInit();
    expect(cookiesService.setSessionCookie).toHaveBeenCalledTimes(
      component.initDeleteCookieeArray.length
    );
    expect(cookiesService.deleteSessionCookie).toHaveBeenCalledTimes(
      component.initDeleteCookieeArray.length
    );
  });

  it('should hide cookies on hideCookies', () => {
    component.hideCookies();
    expect(component.cookiesData.coockiebanner).toBeFalse();
    expect(component.cookiesData.acceptAnalyticsCookies).toBeFalse();
    expect(component.cookiesData.rejectAnalyticsCookies).toBeFalse();
  });

  it('should accept cookies on acceptCookies', () => {
    spyOn(cookiesService, 'setCookie');
    component.acceptCookies('Accept additional cookies');
    expect(component.cookiesData.coockiebanner).toBeFalse();
    expect(component.cookiesData.acceptAnalyticsCookies).toBeTrue();
    expect(component.cookiesData.rejectAnalyticsCookies).toBeFalse();
    expect(cookiesService.setCookie).toHaveBeenCalledWith(
      'ppg_cookies_policy',
      '{"essential":true,"additional":true,"glassbox":true}',
      component.cookieExpirationTimeInMinutes
    );
    expect(cookiesService.setCookie).toHaveBeenCalledWith(
      'ppg_cookies_preferences_set',
      'true',
      component.cookieExpirationTimeInMinutes
    );
  });

  it('should reject cookies on rejectCookies', () => {
    spyOn(cookiesService, 'setCookie');
    spyOn(cookiesService, 'deleteAdditionalCookies');
    component.rejectCookies('Reject additional cookies');
    expect(component.cookiesData.coockiebanner).toBeFalse();
    expect(component.cookiesData.acceptAnalyticsCookies).toBeFalse();
    expect(component.cookiesData.rejectAnalyticsCookies).toBeTrue();
    expect(cookiesService.setCookie).toHaveBeenCalledWith(
      'ppg_cookies_policy',
      '{"essential":true,"additional":false,"glassbox":false}',
      component.cookieExpirationTimeInMinutes
    );
    expect(cookiesService.setCookie).toHaveBeenCalledWith(
      'ppg_cookies_preferences_set',
      'true',
      component.cookieExpirationTimeInMinutes
    );
    expect(cookiesService.deleteAdditionalCookies).toHaveBeenCalled();
  });
});
