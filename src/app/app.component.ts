import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
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
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  @ViewChild('mainContent') tableContainer!: ElementRef;
  public home = environment.uri.ccsDashboardUrl
  @HostBinding('class') className = '';
  public sideNavVisible$: Observable<boolean>;
  public IsActivePage:string=''
  isAuthenticated: boolean = false;
  toggleControl = new FormControl(false);
  opIFrameURL!: SafeResourceUrl;
  rpIFrameURL!: SafeResourceUrl;
  ccsContactUrl: string = environment.uri.ccsContactUrl;
  constructor(private sanitizer: DomSanitizer, private globalRouteService: GlobalRouteService, private overlay: OverlayContainer, private translate: TranslateService, protected uiStore: Store<UIState>, private router: Router,
    private route: ActivatedRoute, public authService: AuthService, private gtmService: GoogleTagManagerService,
    public loadingIndicatorService: LoadingIndicatorService, private titleService: Title, private sessionService:SessionService) {
    translate.setDefaultLang('en');
    this.sideNavVisible$ = this.uiStore.pipe(select(getSideNavVisible));
    this.updateIframeUrls();
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
        this.titleService.setTitle(data + ' - GCA');
      }
    });
  }

  private getDashboardOrigin() {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin;
    }

    const storedRedirectUri = localStorage.getItem('redirect_uri');
    if (storedRedirectUri) {
      try {
        return new URL(storedRedirectUri).origin;
      } catch {
        // Ignore invalid URL values and continue with configured fallback.
      }
    }

    return environment.uri.web.dashboard;
  }

  private updateIframeUrls() {
    const dashboardOrigin = this.getDashboardOrigin();
    this.opIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(environment.uri.api.security + '/security/sessions/?origin=' + dashboardOrigin);
    this.rpIFrameURL = this.sanitizer.bypassSecurityTrustResourceUrl(dashboardOrigin + '/assets/rpIFrame.html');
  }

  private syncAuthStorageOrigins() {
    const configuredSecurityApiUrl = environment.uri.api.security;
    const runtimeDashboardOrigin = this.getDashboardOrigin();

    if (localStorage.getItem('securityapiurl') !== configuredSecurityApiUrl) {
      localStorage.setItem('securityapiurl', configuredSecurityApiUrl);
    }

    if (localStorage.getItem('redirect_uri') !== runtimeDashboardOrigin) {
      localStorage.setItem('redirect_uri', runtimeDashboardOrigin);
    }
  }

  async ngOnInit() {        
    this.syncAuthStorageOrigins();

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {        
        if(localStorage.getItem('user_name') === null){
          if((event).url.split('?')[0] != '/authsuccess'){
            localStorage.setItem('routeRecords',(event).url)            
          }
         }
        if ((event).url != localStorage['currentGlobalRoute']) {
          sessionStorage['previousGlobalRoute'] = localStorage['currentGlobalRoute'];
          localStorage['currentGlobalRoute'] = (event).url;
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

  onSkipMainContent(){
    const container = this.tableContainer.nativeElement;     
    const mainTitle = this.tableContainer.nativeElement.querySelector('.govuk-heading-xl');

    if(mainTitle){           
      if (!mainTitle.hasAttribute('tabindex')) {
        mainTitle.setAttribute('tabindex', '-1');
      }
      
      (mainTitle as HTMLElement).style.scrollMarginTop = '50px';
      mainTitle?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      setTimeout(() =>{
        mainTitle?.focus({ preventScroll: true });
      }, 300)
      
    }
    else{
       // Scroll to main content
      container.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      setTimeout(() =>{
        container?.focus({ preventScroll: false });
      }, 300)      
    }    
  }




  // public isAuthenticated(): Observable<boolean> {
  //   return this.authService.isAuthenticated();
  // }
}
