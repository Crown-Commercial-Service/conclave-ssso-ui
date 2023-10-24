import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookiesSettingsComponent } from './cookies-settings.component';
import { CookiesService } from 'src/app/shared/cookies.service';
import { TranslateModule } from '@ngx-translate/core';

describe('CookiesSettingsComponent', () => {
  let component: CookiesSettingsComponent;
  let fixture: ComponentFixture<CookiesSettingsComponent>;
  let cookiesService: CookiesService;
  let cookieStore: any = {
    ppg_cookies_policy: JSON.stringify({
      additional: 'additional',
      glassbox: 'glassbox',
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookiesSettingsComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [CookiesService],
    }).compileComponents();

    cookiesService = TestBed.inject(CookiesService);

    spyOn(cookiesService, 'getCookie').and.callFake((key) =>
      key in cookieStore ? cookieStore[key] : null
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiesSettingsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties and retrieve user information', () => {
    expect(component.cookiesUpdated).toBeFalsy();
    expect(component.notify_admin_session).toBeDefined();
    expect(component.cookie_policy).toBeDefined();
    expect(component.ccs_sso_visitedsites).toBeDefined();
    expect(component.opbs).toBeDefined();
    expect(component.ccs_sso).toBeDefined();
    expect(component.conclave).toBeDefined();
    expect(component.XSRF_TOKEN).toBeDefined();
    expect(component.XSRF_TOKEN_SVR).toBeDefined();
    expect(component.AspNetCore_Antiforgery_GWNWkbbyKbw).toBeDefined();
    expect(component.auth0_compat).toBeDefined();
    expect(component.did_compat).toBeDefined();
    expect(component.did).toBeDefined();
    expect(component.auth0).toBeDefined();
    expect(component._cf_bm).toBeDefined();
    expect(component.cookieExpirationTimeInMinutes).toBeDefined();
  });

  it('should delete additional cookies if additional preference is set to false', () => {
    spyOn(cookiesService, 'deleteAdditionalCookies');

    component.checkCompination({
      essential: true,
      additional: false,
      glassbox: true,
    });

    expect(cookiesService.deleteAdditionalCookies).toHaveBeenCalled();
  });

  it('should delete GlassBox cookies if glassbox preference is set to false', () => {
    spyOn(cookiesService, 'deleteGlassBoxCookies');

    component.checkCompination({
      essential: true,
      additional: true,
      glassbox: false,
    });

    expect(cookiesService.deleteGlassBoxCookies).toHaveBeenCalled();
  });

  it('should navigate back to the previous page', () => {
    spyOn(window.history, 'back');

    component.onback();

    expect(window.history.back).toHaveBeenCalled();
  });
});
