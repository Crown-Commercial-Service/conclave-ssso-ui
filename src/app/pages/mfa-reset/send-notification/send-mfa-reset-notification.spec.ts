import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendMFAResetNotificationComponent } from './send-mfa-reset-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Store } from '@ngrx/store';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

describe('SendMFAResetNotificationComponent', () => {
  let component: SendMFAResetNotificationComponent;
  let fixture: ComponentFixture<SendMFAResetNotificationComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockMFAService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: {
        subscribe: (callback: Function) => {
          const params = { u: 'encrypted-value' }; // Provide any required query parameters for testing
          callback(params);
        },
      },
    };

    mockRouter = {
      navigateByUrl: jest.fn(),
    };

    mockMFAService = {
      sendResetMFANotification: jest.fn(),
    };

    mockAuthService = {
      logOutAndRedirect: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SendMFAResetNotificationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MFAService, useValue: mockMFAService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Store, useClass: MockStore },
        ViewportScroller,
        ScrollHelper,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMFAResetNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to success page after sending MFA reset notification', async () => {
    await component.ngOnInit();

    expect(mockMFAService.sendResetMFANotification).toHaveBeenCalledWith(
      component.userName
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'mfaresetnotification/success'
    );
  });

  it('should handle error when sending MFA reset notification', async () => {
    mockMFAService.sendResetMFANotification.mockRejectedValue('Error');

    await component.ngOnInit();

    expect(component.sendError).toBe(true);
  });

  it('should call logOutAndRedirect method when navigate link is clicked', () => {
    component.onNavigateLinkClick();

    expect(mockAuthService.logOutAndRedirect).toHaveBeenCalled();
  });
});

class MockStore {
  select() {
    return {
      subscribe: () => {},
    };
  }
}
