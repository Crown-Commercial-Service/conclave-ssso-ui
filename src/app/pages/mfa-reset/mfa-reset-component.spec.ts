import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MFAResetComponent } from './mfa-reset-component';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { AuthService } from 'src/app/services/auth/auth.service';

import { MFAResetComponent } from './mfa-reset-component';

describe('MFAResetComponent', () => {
  let component: MFAResetComponent;
  let fixture: ComponentFixture<MFAResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MFAResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MFAResetComponent);
    component = fixture.componentInstance;
    mfaService = TestBed.inject(MFAService);
    authService = TestBed.inject(AuthService);
    titleService = TestBed.inject(Title);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset MFA and navigate on reset button click', async () => {
    const sendResetMFANotificationSpy = jest
      .spyOn(mfaService, 'sendResetMFANotification')
      .mockReturnValue(null);
    const routerNavigateSpy = jest.spyOn(router, 'navigateByUrl');

    component.userName = 'testUser';
    await component.onResetMfaClick();

    expect(sendResetMFANotificationSpy).toHaveBeenCalledWith('testUser');
    expect(sessionStorage.getItem('MFAResetUserName')).toBe('testUser');
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      'mfaresetnotification/success'
    );
  });

  it('should handle successful MFA reset', () => {
    jest.spyOn(mfaService, 'resetMFA').mockReturnValue(Promise.resolve());

    component.ngOnInit();

    expect(component.resetSuccess).toBe(true);
    expect(component.resultVerified).toBe(true);
    expect(titleService.getTitle()).toBe(
      'Success - Additional security Reset - CCS'
    );
  });

  it('should handle error during MFA reset', () => {
    const errorResponse = {
      error: { error: 'INVALID_TICKET', error_description: 'testUser' },
    };
    jest
      .spyOn(mfaService, 'resetMFA')
      .mockReturnValue(Promise.reject(errorResponse));

    component.ngOnInit();

    expect(component.resetSuccess).toBe(false);
    expect(component.resultVerified).toBe(true);
    expect(titleService.getTitle()).toBe(
      'Error - Additional security Reset - CCS'
    );
    expect(component.userName).toBe('testUser');
  });

  it('should log out and redirect on navigate link click', () => {
    const logOutAndRedirectSpy = jest.spyOn(authService, 'logOutAndRedirect');

    component.onNavigateLinkClick();

    expect(logOutAndRedirectSpy).toHaveBeenCalled();
  });
});
