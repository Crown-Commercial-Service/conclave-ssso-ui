import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfileComponent } from './user-profile-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RollbarErrorService } from '../../shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from '../../logging/rollbar';
import { TokenService } from '../../services/auth/token.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Store, useFactory: () => ({}) },
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const pageTitle = fixture.nativeElement.querySelector('.page-title');
    expect(pageTitle.textContent).toContain('MANAGE_MY_ACCOUNT');
  });

  it('should have a form with formGroup', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
    expect(component.formGroup).toBeTruthy();
  });

  it('should have input fields for first name and last name', () => {
    const firstNameInput = fixture.nativeElement.querySelector('#first-name');
    const lastNameInput = fixture.nativeElement.querySelector('#last-name');
    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
  });

  it('should have a submit button', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton).toBeTruthy();
  });
});
