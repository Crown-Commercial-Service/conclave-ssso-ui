import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CookiesService {
    public  cookieExpirationTimeInMinutes = environment.cookieExpirationTimeInMinutes

    constructor() { }
    public googleAnalyticsCookies=['_gat_gtag_UA_47046847_23','_gid','_ga','_gat_UA','_ga_624NHLKTKL']
    public glassBoxCookies=['_cls_v','_cls_s']


    /**
   * Get cookies functionality
   * @param cname Passing cookies name
   * @returns Return cookies value
   */
    public getCookie(cname: string) {
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

    public setSessionCookie(cname: string, cvalue: string, exmin: number) {
        const d = new Date();
        d.setTime(d.getTime() + (exmin * 60000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.crowncommercial.gov.uk;";
        // const d = new Date();
        // const yesterday = new Date(d)
        // d.setDate(yesterday.getDate() - 1)
        // let expires = "expires=" + d.toUTCString();
        // document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.crowncommercial.gov.uk;path=/;SameSite=Lax";
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
    public deleteSessionCookie(cname: string, cvalue: string) {
        let expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.crowncommercial.gov.uk";
    }

    /**
     * Delete additional cookies calling methode
     */
    public deleteAdditionalCookies() { // delete additional cookies
        setTimeout(() => {
            this.googleAnalyticsCookies.forEach((f)=>{
                this.setSessionCookie(f,'removed',this.cookieExpirationTimeInMinutes)
              })
        }, 500);
    }


    /**
     * Delete GlassBox cookies calling methode
     */
    public deleteGlassBoxCookies() {
        setTimeout(() => {
            this.glassBoxCookies.forEach((f)=>{
                this.setSessionCookie(f,'removed',this.cookieExpirationTimeInMinutes)
              }) 
        }, 500);

    }

    public deleteNoneCookies(cname: string, cvalue: string) {
        let expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.crowncommercial.gov.uk;path=/;SameSite=None";

    }
}
