import { Component, OnInit } from '@angular/core';
import { CookiesService } from 'src/app/shared/cookies.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cookies-banner',
  templateUrl: './cookies-banner.component.html',
  styleUrls: ['./cookies-banner.component.scss'],
})
export class CookiesBannerComponent implements OnInit {
  private  cookieExpirationTimeInMinutes = environment.cookieExpirationTimeInMinutes
  public cookiesData:any = {
    coockiebanner: true,
    acceptAnalyticsCookies: false,
    rejectAnalyticsCookies: false,
  };

  constructor(private CookiesService:CookiesService) {}
  
  
  ngOnInit(): void {
    this.initializerCookies()
  }

  /**
   * Cookie initializer functionality
   */
  public initializerCookies(){
    let cookiePreferenceSetCookie = this.CookiesService.getCookie("ppg_cookies_preferences_set");
    let cookiePolicyCookie = this.CookiesService.getCookie("ppg_cookies_policy");
    if (cookiePreferenceSetCookie != '' && cookiePolicyCookie != '') {
      this.hideCookies();
      if (!JSON.parse(cookiePolicyCookie).additional) {
        this.CookiesService.deleteAdditionalCookies();
      }
    } else {
      this.CookiesService.deleteAdditionalCookies();
      this.CookiesService.setCookie("ppg_cookies_policy", '{"essential":true,"additional":false}', this.cookieExpirationTimeInMinutes);
    }
   }


  public acceptCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = true;
    this.cookiesData.rejectAnalyticsCookies = false;
    this.CookiesService.setCookie("ppg_cookies_policy", '{"essential":true,"additional":true}', this.cookieExpirationTimeInMinutes);
    this.CookiesService.setCookie("ppg_cookies_preferences_set", 'true', this.cookieExpirationTimeInMinutes);
  }

  public rejectCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = false;
    this.cookiesData.rejectAnalyticsCookies = true;
    this.CookiesService.setCookie("ppg_cookies_policy", '{"essential":true,"additional":false}', this.cookieExpirationTimeInMinutes);
    this.CookiesService.setCookie("ppg_cookies_preferences_set", 'true', this.cookieExpirationTimeInMinutes);
    this.CookiesService.deleteAdditionalCookies()
  }

  public hideCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = false;
    this.cookiesData.rejectAnalyticsCookies = false;
  }

}
