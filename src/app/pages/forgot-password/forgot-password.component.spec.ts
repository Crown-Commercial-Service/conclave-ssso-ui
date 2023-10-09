import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let translateService: TranslateService;
  let authService: AuthService;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
    const authServiceStub = () => ({
      resetPassword: (username: string) => ({
        toPromise: () => ({ then: () => ({ catch: () => ({}) }) }),
      }),
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ForgotPasswordComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: AuthService,
          useFactory: authServiceStub,
        },
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with correct validators', () => {
    expect(component.resetForm).toBeDefined();
    expect(component.resetForm.controls.userName).toBeDefined();
    expect(component.resetForm.controls.userName.value).toBe('');
    expect(component.resetForm.controls.userName.valid).toBeFalsy();

    component.resetForm.controls.userName.setValue('test@example.com');
    expect(component.resetForm.controls.userName.valid).toBeTruthy();
  });

  it('should call setFocus method', () => {
    const inputIndex = 0;
    const inputs = component.inputs.toArray();
    spyOn(inputs[inputIndex].nativeElement, 'focus');

    component.setFocus(inputIndex);

    expect(inputs[inputIndex].nativeElement.focus).toHaveBeenCalled();
  });

  it('should return true for formValid method if form is valid', () => {
    const formBuilder = TestBed.inject(FormBuilder);
    const form = formBuilder.group({
      userName: ['test@example.com'],
    });

    const result = component.formValid(form);

    expect(result).toBeTruthy();
  });

  it('should navigate to login page on cancel click', () => {
    component.onCancelClick();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('login');
  });
});
