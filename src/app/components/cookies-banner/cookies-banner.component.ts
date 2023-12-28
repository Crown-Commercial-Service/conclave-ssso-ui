import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CookiesService } from 'src/app/shared/cookies.service';
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-cookies-banner',
  templateUrl: './cookies-banner.component.html',
  styleUrls: ['./cookies-banner.component.scss'],
})
export class CookiesBannerComponent implements OnInit , AfterViewInit {
  public  cookieExpirationTimeInMinutes = environment.cookieExpirationTimeInMinutes
  public cookiesData:any = {
    coockiebanner: false,
    acceptAnalyticsCookies: false,
    rejectAnalyticsCookies: false,
  };
  initDeleteCookieeArray=['_gid','_ga','_gat_UA','_ga_624NHLKTKL','_cls_v','_cls_s']
  constructor(private CookiesService:CookiesService, public dataLayerService: DataLayerService) {}


  ngAfterViewInit(): void {
    setTimeout(() => {
    this.initializerCookies()
    }, 500);
  }
  
  
  ngOnInit(): void {
    this.initDeleteCookieeArray.forEach((f)=>{
      this.CookiesService.setSessionCookie(f,'removed',this.cookieExpirationTimeInMinutes)
    })
    this.initDeleteCookieeArray.forEach((f)=>{
      this.CookiesService.deleteSessionCookie(f,'removed')
    })
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
      if (!JSON.parse(cookiePolicyCookie).glassbox) {
        this.CookiesService.deleteGlassBoxCookies();  
      }
    } else {
      this.cookiesData.coockiebanner = true;
      this.CookiesService.deleteAdditionalCookies();
      this.CookiesService.deleteGlassBoxCookies(); 
      this.CookiesService.setCookie("ppg_cookies_policy", '{"essential":true,"additional":false,"glassbox":false}', this.cookieExpirationTimeInMinutes);
    }
   }


  public acceptCookies(buttonText: string): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = true;
    this.cookiesData.rejectAnalyticsCookies = false;
    this.CookiesService.setCookie("ppg_cookies_policy", '{"essential":true,"additional":true,"glassbox":true}', this.cookieExpirationTimeInMinutes);
    this.CookiesService.setCookie("ppg_cookies_preferences_set", 'true', this.cookieExpirationTimeInMinutes);
    this.dataLayerService.pushClickEvent(buttonText);
  }

  public rejectCookies(buttonText: string): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = false;
    this.cookiesData.rejectAnalyticsCookies = true;
    this.CookiesService.setCookie("ppg_cookies_policy", '{"essential":true,"additional":false,"glassbox":false}', this.cookieExpirationTimeInMinutes);
    this.CookiesService.setCookie("ppg_cookies_preferences_set", 'true', this.cookieExpirationTimeInMinutes);
    this.CookiesService.deleteAdditionalCookies();
    this.dataLayerService.pushClickEvent(buttonText);
  }

  public hideCookies(buttonText: string = ""): void {
    this.cookiesData.coockiebanner = false;
    this.cookiesData.acceptAnalyticsCookies = false;
    this.cookiesData.rejectAnalyticsCookies = false;
    if(buttonText != ""){
      this.dataLayerService.pushClickEvent(buttonText);
    }
  }

}