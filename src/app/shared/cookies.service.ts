import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor() { }


    /**
   * Get cookies functionality
   * @param cname Passing cookies name
   * @returns Return cookies value
   */
     public  getCookie(cname: string) {
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
   public setCookie(cname: string, cvalue: string, exmin: number) {
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
   public deleteCookie(cname: string, cvalue: string) {
       let expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
       document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.crowncommercial.gov.uk;path=/;SameSite=Lax";
  }
  
  /**
   * Delete additional cookies calling methode
   */
   public deleteAdditionalCookies() { // delete additional cookies
       this.deleteCookie("test_additional", 'test');
       this.deleteCookie("_gid", 'removed');
       this.deleteCookie("_ga", 'removed');
       this.deleteCookie("_gat_UA-47046847-22", 'removed');
   }
}
