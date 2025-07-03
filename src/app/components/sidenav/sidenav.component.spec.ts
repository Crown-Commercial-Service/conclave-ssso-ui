import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNavComponent } from './sidenav.component';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideNavComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
      imports: [              
        BrowserAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the side navigation component', () => {
    expect(component).toBeTruthy();
  });

  it('should call logOut method when logOut button is clicked', () => {
    spyOn(authService, 'logOutAndRedirect');
    component.logOut();
    expect(authService.logOutAndRedirect).toHaveBeenCalled();
  });

  it('should return the authentication status as an Observable', () => {
    const isAuthenticatedMock = true;
    spyOn(authService, 'isAuthenticated').and.returnValue(
      of(isAuthenticatedMock)
    );
    const isAuthenticated$: Observable<boolean> = component.isAuthenticated();
    isAuthenticated$.subscribe((isAuthenticated) => {
      expect(isAuthenticated).toEqual(isAuthenticatedMock);
    });
  });

  it('should render the side navigation menu when user is authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(true));
    fixture.detectChanges();
    const sideNavElement: HTMLElement = fixture.nativeElement;
    const sideNavMenuElement =
      sideNavElement.querySelector('.mlp-sidenav-menu');
    expect(sideNavMenuElement).toBeTruthy();
  });
});
