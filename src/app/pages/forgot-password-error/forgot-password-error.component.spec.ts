import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordErrorComponent } from './forgot-password-error.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotPasswordErrorComponent', () => {
  let component: ForgotPasswordErrorComponent;
  let fixture: ComponentFixture<ForgotPasswordErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(),RouterTestingModule],
      declarations: [ForgotPasswordErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should go back in history when onBack is called', () => {
    spyOn(window.history, 'back');
    component.onBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should render the error message', () => {
    const errorMessage =
      'Due to suspicious activity on your account your password cannot be reset at this time please contact your Organisation Administrator';
    const anchorElement: HTMLAnchorElement =
      fixture.nativeElement.querySelector('.govuk-error-summary__body a');
    expect(anchorElement.textContent).toContain(errorMessage);
  });
});
