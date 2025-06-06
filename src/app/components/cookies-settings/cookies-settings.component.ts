import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesService } from 'src/app/shared/cookies.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-cookies-settings',
    templateUrl: './cookies-settings.component.html',
    styleUrls: ['./cookies-settings.component.scss'],
    standalone: false
})
export class CookiesSettingsComponent implements OnInit {
  public cookiesUpdated: boolean = false;
  public notify_admin_session = environment.cookies_policy.essentialcookies.notify_admin_session;
  public cookie_policy =environment.cookies_policy.essentialcookies.cookie_policy;
  public ccs_sso_visitedsites =environment.cookies_policy.essentialcookies.ccs_sso_visitedsites;
  public opbs = environment.cookies_policy.essentialcookies.opbs;
  public ccs_sso = environment.cookies_policy.essentialcookies.ccs_sso;
  public conclave = environment.cookies_policy.essentialcookies.conclave;
  public XSRF_TOKEN = environment.cookies_policy.essentialcookies.XSRF_TOKEN;
  public XSRF_TOKEN_SVR = environment.cookies_policy.essentialcookies.XSRF_TOKEN_SVR;
  public AspNetCore_Antiforgery_GWNWkbbyKbw = environment.cookies_policy.essentialcookies.AspNetCore_Antiforgery_GWNWkbbyKbw;
  public auth0_compat = environment.cookies_policy.Auth0cookies.auth0_compat;
  public did_compat = environment.cookies_policy.Auth0cookies.did_compat;
  public did = environment.cookies_policy.Auth0cookies.did;
  public auth0 = environment.cookies_policy.Auth0cookies.auth0;
  public _cf_bm = environment.cookies_policy.Auth0cookies.__cf_bm;
  public cookieExpirationTimeInMinutes =environment.cookieExpirationTimeInMinutes;
  public cookiesValue = {
    essential: true,
    additional: false,
    glassbox: false
  }
  public ppg_cookies_preferences_set: string = this.CookiesService.getCookie('ppg_cookies_preferences_set');
  public ppg_cookies_policy: string = this.CookiesService.getCookie('ppg_cookies_policy');
  public userName =  '';
  public isOrgAdmin: boolean = false;
  public isFormEdited: boolean = false;
  public formId : string = 'cookies_settings';

  constructor(private CookiesService: CookiesService,private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.userName = this.sessionService.decrypt('user_name')
   }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
    this.cookiesValue = JSON.parse(this.ppg_cookies_policy)
    if (this.ppg_cookies_preferences_set == "true") {
      this.cookiesValue = JSON.parse(this.ppg_cookies_policy)
    }
  }

  public OnSubmit() {
    const cookies_prefernace = JSON.stringify(this.cookiesValue)
    this.CookiesService.setCookie('ppg_cookies_policy', cookies_prefernace, this.cookieExpirationTimeInMinutes);
    this.CookiesService.setCookie('ppg_cookies_preferences_set', 'true', this.cookieExpirationTimeInMinutes);
    this.cookiesUpdated = true;
    this.checkCompination(this.cookiesValue)
    setTimeout(() => {
      this.scrollView()
    }, 500);
    this.dataLayerService.pushFormSubmitEvent(this.formId);
  }

  public checkCompination(cookiesValue:any):void{
   if(cookiesValue.additional === false){
    this.CookiesService.deleteAdditionalCookies()
   } 
   if(cookiesValue.glassbox === false){
    this.CookiesService.deleteGlassBoxCookies()
   } 
  }

  public onback(): void {
    window.history.back();
  }

  public scrollView(): void {
    const element = document.getElementById("govuk-notification-banner-title");
    element?.scrollIntoView();
  }

  public formEdited() {
    if(this.isFormEdited == false){
      this.dataLayerService.pushFormStartOnInitEvent(this.formId);
      this.isFormEdited = true;
    }
  }
}
