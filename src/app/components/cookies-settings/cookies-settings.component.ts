import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cookies-settings',
  templateUrl: './cookies-settings.component.html',
  styleUrls: ['./cookies-settings.component.scss']
})
export class CookiesSettingsComponent implements OnInit {
  notify_admin_session =  environment.cookies_policy.essentialcookies.notify_admin_session;
  cookie_policy =  environment.cookies_policy.essentialcookies.cookie_policy;
  
  ccs_sso_visitedsites=environment.cookies_policy.essentialcookies['ccs-sso-visitedsites']
  opbs =  environment.cookies_policy.essentialcookies.opbs;
  ccs_sso=environment.cookies_policy.essentialcookies['ccs-sso'];
  conclave=environment.cookies_policy.essentialcookies.conclave;
  XSRF_TOKEN=environment.cookies_policy.essentialcookies['XSRF-TOKEN'];
  XSRF_TOKEN_SVR=environment.cookies_policy.essentialcookies['XSRF-TOKEN-SVR'];
  AspNetCore_Antiforgery_GWNWkbbyKbw= environment.cookies_policy.essentialcookies['AspNetCore.Antiforgery.GWNWkbbyKbw']

  auth0_compat =  environment.cookies_policy.Auth0cookies.auth0_compat;
  did_compat =  environment.cookies_policy.Auth0cookies.did_compat;
  did =  environment.cookies_policy.Auth0cookies.did;
  auth0 =  environment.cookies_policy.Auth0cookies.auth0;
  _cf_bm =  environment.cookies_policy.Auth0cookies.__cf_bm;

  constructor() { }

  ngOnInit(): void {
  }

}
