import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PatternService } from 'src/app/shared/pattern.service';
import { UserService } from 'src/app/services/postgres/user.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { TokenService } from 'src/app/services/auth/token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const storeMock = jasmine.createSpyObj('Store', ['dispatch']);
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) },
    });

    await TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useValue: routerMock },
        { provide: Store, useValue: storeMock },
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home page when nevigateToHome() is called', () => {
    component.userName = 'testUser';
    component.nevigateToHome();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home'], {
      replaceUrl: true,
    });
  });

  it('should log out the user when signoutUser() is called', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'logOutAndRedirect');
    component.signoutUser();

    expect(authService.logOutAndRedirect).toHaveBeenCalled();
  });

  it('should navigate to dashboard when goToDashboard() is called', () => {
    component.goToDashboard();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home'], {
      replaceUrl: true,
    });
  });

  it('should validate email length and set errors correctly', () => {
    const patternService = TestBed.inject(PatternService);
    spyOn(patternService, 'emailValidator').and.returnValue(true);
    component.resendForm = component.formBuilder.group({
      userName: '',
    });
    component.validateEmailLength({ target: { value: 'test@example.com' } });
    expect(component.resendForm.controls.userName.errors).toEqual({
      incorrect: true,
    });
  });

  it('should return true when formValid() is called with a valid form', () => {
    const form = component.formBuilder.group({
      userName: 'test@example.com',
    });
    const result = component.formValid(form);
    expect(result).toBeTrue();
  });
});
