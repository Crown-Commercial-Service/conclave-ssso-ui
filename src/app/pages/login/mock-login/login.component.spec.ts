import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RollbarErrorService } from '../../../shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from '../../../logging/rollbar';
import { TokenService } from '../../../services/auth/token.service';
import { Store } from '@ngrx/store';
import { UIState } from 'src/app/store/ui.states';

import { AuthService } from 'src/app/services/auth/auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let location: Location;
  let mockStore: jasmine.SpyObj<Store<UIState>>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        AuthService,
        Location,
        RollbarErrorService,
        TokenService,
        { provide: Store, useValue: mockStore },
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create the LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group', () => {
    expect(component.formGroup).toBeDefined();
  });

  it('should call authService.login() on form submission', () => {
    spyOn(authService, 'login');
    const form = component.formGroup;
    form.controls['userName'].setValue('testuser');
    form.controls['password'].setValue('testpassword');
    component.onSubmit(form);
    expect(authService.login).toHaveBeenCalledWith('testuser', 'testpassword');
  });

  it('should navigate back on cancel button click', () => {
    spyOn(location, 'back');
    component.onCancelClick('Cancel');
    expect(location.back).toHaveBeenCalled();
  });
});
