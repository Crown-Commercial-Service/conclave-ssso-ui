import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookies-banner',
  templateUrl: './cookies-banner.component.html',
  styleUrls: ['./cookies-banner.component.scss'],
})
export class CookiesBannerComponent implements OnInit {
  public cookiesData = {
    coockiebanner: true,
    acceptAnalyticsCookies: false,
    rejectAnalyticsCookies: false,
  };

  constructor() {}
  
  
  ngOnInit(): void {
    console.log("cookies",this.getCookie("ppg_cookies_preferences_set"));

  }

  public acceptCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = true;
    this.cookiesData.rejectAnalyticsCookies = false;
  }

  public rejectCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = false;
    this.cookiesData.rejectAnalyticsCookies = true;
  }

  public hideCookies(): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = false;
    this.cookiesData.rejectAnalyticsCookies = false;
  }

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

  private setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.crowncommercial.gov.uk;path=/;SameSite=Lax";
    }
  }
