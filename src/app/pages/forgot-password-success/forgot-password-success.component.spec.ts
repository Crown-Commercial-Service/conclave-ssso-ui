import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ForgotPasswordSuccessComponent } from './forgot-password-success';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { Store } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ForgotPasswordSuccessComponent', () => {
  let component: ForgotPasswordSuccessComponent;
  let fixture: ComponentFixture<ForgotPasswordSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordSuccessComponent],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        TranslateService,
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct page title', () => {
    const pageTitleElement: HTMLElement =
      fixture.nativeElement.querySelector('.page-title');
    expect(pageTitleElement.textContent).toContain('Please check your inbox');
  });

  it('should display the translated success message with the username', () => {
    const successMessageElement: HTMLElement =
      fixture.nativeElement.querySelector('.govuk-body-l');
    expect(successMessageElement.textContent).toContain(
      'FORGOT_PASSWORD_SUCCESS'
    );
    expect(successMessageElement.textContent).toContain(component.userName);
  });

  it('should display the translated description', () => {
    const descriptionElement: HTMLElement =
      fixture.nativeElement.querySelectorAll('.govuk-body-l')[1];
    expect(descriptionElement.textContent).toContain('FORGOT_PASSWORD_DES');
  });

  // it('should navigate to the login page when the link is clicked', () => {
  //   spyOn(component.authService, 'logOutAndRedirect');
  //   const linkElement: HTMLElement =
  //     fixture.nativeElement.querySelectorAll('.navigation-text')[1];       
  //   linkElement.click();
  //   expect(component.authService.logOutAndRedirect).toHaveBeenCalled();
  // });
});
