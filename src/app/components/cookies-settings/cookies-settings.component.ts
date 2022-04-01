import { Component, OnInit } from '@angular/core';
import { CookiesService } from 'src/app/shared/cookies.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cookies-settings',
  templateUrl: './cookies-settings.component.html',
  styleUrls: ['./cookies-settings.component.scss'],
})
export class CookiesSettingsComponent implements OnInit {
  public notify_admin_session =
    environment.cookies_policy.essentialcookies.notify_admin_session;
  public cookie_policy =
    environment.cookies_policy.essentialcookies.cookie_policy;

  public ccs_sso_visitedsites =
    environment.cookies_policy.essentialcookies['ccs-sso-visitedsites'];
  public opbs = environment.cookies_policy.essentialcookies.opbs;
  public ccs_sso = environment.cookies_policy.essentialcookies['ccs-sso'];
  public conclave = environment.cookies_policy.essentialcookies.conclave;
  public XSRF_TOKEN = environment.cookies_policy.essentialcookies['XSRF-TOKEN'];
  public XSRF_TOKEN_SVR =
    environment.cookies_policy.essentialcookies['XSRF-TOKEN-SVR'];
  public AspNetCore_Antiforgery_GWNWkbbyKbw =
    environment.cookies_policy.essentialcookies[
      'AspNetCore.Antiforgery.GWNWkbbyKbw'
    ];

  public auth0_compat = environment.cookies_policy.Auth0cookies.auth0_compat;
  public did_compat = environment.cookies_policy.Auth0cookies.did_compat;
  public did = environment.cookies_policy.Auth0cookies.did;
  public auth0 = environment.cookies_policy.Auth0cookies.auth0;
  public _cf_bm = environment.cookies_policy.Auth0cookies.__cf_bm;

  private cookieExpirationTimeInMinutes =
    environment.cookieExpirationTimeInMinutes;

  public SelectionMode: string = '';
  private ppg_cookies_preferences_set: string = this.CookiesService.getCookie(
    'ppg_cookies_preferences_set'
  );
  private ppg_cookies_policy: string =
    this.CookiesService.getCookie('ppg_cookies_policy');

  constructor(private CookiesService: CookiesService) {}

  ngOnInit(): void {
    if (
      (this.ppg_cookies_preferences_set == '' ||
        this.ppg_cookies_preferences_set == null) &&
      (this.ppg_cookies_policy == '' || this.ppg_cookies_policy == null)
    ) {
      this.SelectionMode = 'off';
    } else {
      this.SelectionMode = 'on';
    }
  }

  public OnSubmit() {
    if (this.SelectionMode === 'on') {
      this.acceptCookies();
    } else {
      this.rejectCookies();
    }
  }

  public acceptCookies(): void {
    this.CookiesService.setCookie(
      'ppg_cookies_policy',
      '{"essential":true,"additional":true}',
      this.cookieExpirationTimeInMinutes
    );
    this.CookiesService.setCookie(
      'ppg_cookies_preferences_set',
      'true',
      this.cookieExpirationTimeInMinutes
    );
  }

  public rejectCookies(): void {
    this.CookiesService.setCookie(
      'ppg_cookies_policy',
      '{"essential":true,"additional":false}',
      this.cookieExpirationTimeInMinutes
    );
    this.CookiesService.setCookie(
      'ppg_cookies_preferences_set',
      'true',
      this.cookieExpirationTimeInMinutes
    );
    this.CookiesService.deleteAdditionalCookies();
  }
}
