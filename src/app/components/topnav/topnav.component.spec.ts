import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavComponent } from './topnav.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [TopNavComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isAuthenticated property based on user authentication status', () => {
    const mockIsAuthenticated = true;
    spyOn(authService, 'isUserAuthenticated').and.returnValue(
      mockIsAuthenticated
    );

    component.ngOnInit();

    expect(component.isAuthenticated).toBe(mockIsAuthenticated);
    expect(authService.isUserAuthenticated).toHaveBeenCalled();
  });

  it('should call logOutAndRedirect method when signout is triggered', () => {
    spyOn(authService, 'logOutAndRedirect');

    component.signout();

    expect(authService.logOutAndRedirect).toHaveBeenCalled();
  });
});
