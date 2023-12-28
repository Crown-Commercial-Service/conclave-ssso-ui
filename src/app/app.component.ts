import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { UIState } from './store/ui.states';
import { getSideNavVisible } from './store/ui.selectors';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterState } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { LoadingIndicatorService } from './services/helper/loading-indicator.service';
import { filter, map } from 'rxjs/operators';
import { GlobalRouteService } from './services/helper/global-route.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { SessionService } from './shared/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public home = environment.uri.ccsDashboardUrl
  @HostBinding('class') className = '';
  public sideNavVisible$: Observable<boolean>;
  public IsActivePage:string=''
  isAuthenticated: boolean = false;
  toggleControl = new FormControl(false);
  opIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(environment.uri.api.security + '/security/sessions/?origin=' + environment.uri.web.dashboard);
  rpIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(environment.uri.web.dashboard + '/assets/rpIFrame.html');
  ccsContactUrl: string = environment.uri.ccsContactUrl;
  constructor(private sanitizer: DomSanitizer, private globalRouteService: GlobalRouteService, private overlay: OverlayContainer, private translate: TranslateService, protected uiStore: Store<UIState>, private router: Router,
    private route: ActivatedRoute, public authService: AuthService, private gtmService: GoogleTagManagerService,
    public loadingIndicatorService: LoadingIndicatorService, private titleService: Title, private sessionService:SessionService) {
    translate.setDefaultLang('en');
    this.sideNavVisible$ = this.uiStore.pipe(select(getSideNavVisible));
    //this.gtmService.addGtmToDom();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), map(() => {
      let child = this.route.firstChild;
      while (child) {
        if (child.firstChild) {
          child = child.firstChild;
        } else if (child.snapshot.data && child.snapshot.data['title']) {
          return child.snapshot.data['title'];
        } else {
          return null;
        }
      }

      return null;
    })
    ).subscribe((data: any) => {
      if (data) {
        this.IsActivePage=data
        let gtmTag = {
          event: 'page',
          pageName: data
        };
        // Can be removed this event when tested by analytics team
        // this.gtmService.pushTag(gtmTag);
        this.titleService.setTitle(data + ' - CCS');
      }
    });
  }

  async ngOnInit() {        
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if(this.sessionService.decrypt('user_name')=== null){
          if((<NavigationEnd>event).url.split('?')[0] != '/authsuccess'){
            localStorage.setItem('routeRecords',(<NavigationEnd>event).url)
          }
         }
        if ((<NavigationEnd>event).url != localStorage['currentGlobalRoute']) {
          sessionStorage['previousGlobalRoute'] = localStorage['currentGlobalRoute'];
          localStorage['currentGlobalRoute'] = (<NavigationEnd>event).url;
        }
        if ((<NavigationEnd>event).url.includes('verify-user?details=')) {
          localStorage.setItem('routeRecords',(<NavigationEnd>event).url);
        }
      }
    });

    this.isAuthenticated = this.authService.isUserAuthenticated();
    if (this.isAuthenticated) {
      let tokenExists = await this.authService.isInMemoryTokenExists()
      // This handles page refresh to reload access tokens. Ignore authSuccess page 
      var currentGlobalRoute = localStorage['currentGlobalRoute'];
      if (!tokenExists && !currentGlobalRoute.includes('authsuccess')) {
        this.authService.registerTokenRenewal();
        // Url after trimming the leading slash
        let url = currentGlobalRoute.startsWith('/') ? currentGlobalRoute.replace(/^\/+/, '') : currentGlobalRoute;
        this.globalRouteService.globalRoute = url;
        if(this.globalRouteService.globalRoute.indexOf("mfa-selection") < 0){
          this.router.navigate(['/renewtkn'], { replaceUrl: true });
        }
        else
        {
          this.authService.useTokenFromStorage();
          let url = this.globalRouteService.globalRoute.length > 0 ? this.globalRouteService.globalRoute : 'home';
          this.router.navigateByUrl(url, { replaceUrl: true });
        }
      }
      else {
        this.authService.registerTokenRenewal();
      }
    }
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
    if (!this.sessionService.decrypt('client_id')) {
      this.sessionService.encrypt('client_id',environment.idam_client_id)
    }
    if (!localStorage.getItem('securityapiurl')) {
      localStorage.setItem('securityapiurl', environment.uri.api.security);
    }
    if (!localStorage.getItem('redirect_uri')) {
      localStorage.setItem('redirect_uri', environment.uri.web.dashboard);
    }
  }

  navigate(tab: any, subLink = null) {
    // this.selectedTab = tab.name;
  }

  onToggle(): void {
    this.uiStore.dispatch({ type: '[UI] Side Nav Toggle' });
  }

  public signoutAndRedirect() {
    this.authService.logOutAndRedirect();
  }




  // public isAuthenticated(): Observable<boolean> {
  //   return this.authService.isAuthenticated();
  // }
}
