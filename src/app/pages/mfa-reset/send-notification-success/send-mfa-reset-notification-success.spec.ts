// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SendMFAResetNotificationSuccessComponent } from './send-mfa-reset-notification-success';
// import { TranslateModule } from '@ngx-translate/core';
// import { ActivatedRoute } from '@angular/router';

// describe('SendMFAResetNotificationSuccessComponent', () => {
//   let component: SendMFAResetNotificationSuccessComponent;
//   let fixture: ComponentFixture<SendMFAResetNotificationSuccessComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [TranslateModule.forRoot()],
//       declarations: [SendMFAResetNotificationSuccessComponent],
//       providers: [ActivatedRoute],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SendMFAResetNotificationSuccessComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display the success message with the username', () => {
//     const userName = 'JohnDoe';
//     component.userName = userName;
//     fixture.detectChanges();

//     const successMessage = fixture.nativeElement.querySelector('.govuk-body-l');
//     expect(successMessage.textContent).toContain('MFA_RESET_EMAIL_SENT');
//     expect(successMessage.textContent).toContain(userName);
//   });

//   it('should call logOutAndRedirect method when the navigate link is clicked', () => {
//     spyOn(component.authService, 'logOutAndRedirect');
//     const navigateLink =
//       fixture.nativeElement.querySelector('.navigation-text');
//     navigateLink.click();

//     expect(component.authService.logOutAndRedirect).toHaveBeenCalled();
//   });
// });
