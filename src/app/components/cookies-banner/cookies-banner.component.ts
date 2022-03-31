import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookies-banner',
  templateUrl: './cookies-banner.component.html',
  styleUrls: ['./cookies-banner.component.scss'],
})
export class CookiesBannerComponent implements OnInit {
  private  cookieExpirationTimeInMinutes = 10; // 525600 => 365 Days
  public cookiesData = {
    coockiebanner: true,
    acceptAnalyticsCookies: false,
    rejectAnalyticsCookies: false,
  };

  constructor() {}
  
  
  ngOnInit(): void {
    console.log("ppg_cookies_preferences_set",this.getCookie("ppg_cookies_preferences_set"));
    console.log("ppg_cookies_policy",this.getCookie("ppg_cookies_policy"));
    this.initializerCookies()
  }

  /**
   * Cookie initializer functionality
   */
  public initializerCookies(){
    let cookiePreferenceSetCookie = this.getCookie("ppg_cookies_preferences_set");
    let cookiePolicyCookie = this.getCookie("ppg_cookies_policy");
    if (cookiePreferenceSetCookie != "" && cookiePolicyCookie != "") {
                this.hideCookies()
          if (!JSON.parse(cookiePolicyCookie).additional) {
                this.deleteAdditionalCookies();
          }
      }
   }


  public acceptCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = true;
    this.cookiesData.rejectAnalyticsCookies = false;
    this.setCookie("ppg_cookies_policy", '{"essential":true,"additional":true}', this.cookieExpirationTimeInMinutes);
    this.setCookie("ppg_cookies_preferences_set", 'true', this.cookieExpirationTimeInMinutes);
  }

  public rejectCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = false;
    this.cookiesData.rejectAnalyticsCookies = true;
    this.setCookie("ppg_cookies_policy", '{"essential":true,"additional":false}', this.cookieExpirationTimeInMinutes);
    this.setCookie("ppg_cookies_preferences_set", 'true', this.cookieExpirationTimeInMinutes);
    this.deleteAdditionalCookies()
  }

  public hideCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = false;
    this.cookiesData.rejectAnalyticsCookies = false;
  }


  /**
   * Get cookies functionality
   * @param cname Passing cookies name
   * @returns Return cookies value
   */
  private  getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Set cookie core functionality
 * @param cname Cookie name
 * @param cvalue Cookie value
 * @param exmin Cookie default time
 */
  private setCookie(cname: string, cvalue: string, exmin: number) {
     const d = new Date();
     d.setTime(d.getTime() + (exmin * 60000));
     let expires = "expires=" + d.toUTCString();
     document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.crowncommercial.gov.uk;path=/;SameSite=Lax";
}

/**
 * Delete additional cookies core functionality
 * @param cname Cookie name
 * @param cvalue Cookie Value
 */
  private deleteCookie(cname: string, cvalue: string) {
     let expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
     document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.crowncommercial.gov.uk;path=/;SameSite=Lax";
}

/**
 * Delete additional cookies calling methode
 */
  private deleteAdditionalCookies() { // delete additional cookies
     this.deleteCookie("test_additional", 'test');
     this.deleteCookie("_gid", 'removed');
     this.deleteCookie("_ga", 'removed');
     this.deleteCookie("_gat_UA-47046847-22", 'removed');
 }
}
