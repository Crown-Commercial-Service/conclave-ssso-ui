import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { AuthService } from '../../services/auth/auth.service';
import { OperationFailedComponent } from './operation-failed.component';
import { RollbarErrorService } from '../../shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from '../../logging/rollbar';
import { TokenService } from '../../services/auth/token.service';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('OperationFailedComponent', () => {
  let component: OperationFailedComponent;
  let fixture: ComponentFixture<OperationFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      declarations: [OperationFailedComponent],
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
    fixture = TestBed.createComponent(OperationFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to sign in page on "onNavigateToSignInClick" method call', () => {
    spyOn(component['authService'], 'logOutAndRedirect');
    component.onNavigateToSignInClick();
    expect(component['authService'].logOutAndRedirect).toHaveBeenCalled();
  });

  it('should navigate to manage users page on "onNavigateToManageUserClick" method call', () => {
    spyOn(component['router'], 'navigateByUrl');
    component.onNavigateToManageUserClick();
    expect(component['router'].navigateByUrl).toHaveBeenCalledWith(
      'manage-users'
    );
  });

  it('should go back in history on "goBack" method call', () => {
    spyOn(window.history, 'back');
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should render the template correctly for operation "PasswordChanged"', () => {
    component.operation = component.operationEnum.PasswordChanged;
    component.isOrgAdmin = true;
    fixture.detectChanges();

    const breadcrumbsLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbsLinks.length).toBe(4);
    expect(breadcrumbsLinks[0].textContent).toContain(
      'ADMINISTRATOR_DASHBOARD'
    );
    expect(breadcrumbsLinks[1].textContent).toContain('MANAGE_MY_ACCOUNT');
    expect(breadcrumbsLinks[2].textContent).toContain('CHANGE_PASSWORD_BTN');
    expect(breadcrumbsLinks[3].textContent).toContain('Error');

    const errorText = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(errorText.textContent).toContain('AUTH_FAILED_FRO_PASSWORD_CHANGE');

    const signInLink = fixture.nativeElement.querySelector('.navigation-text');
    expect(signInLink.textContent).toContain('SING_IN_AGAIN');
  });
});
