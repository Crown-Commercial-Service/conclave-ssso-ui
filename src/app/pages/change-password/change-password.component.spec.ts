import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authService: AuthService;
  let location: Location;
  let localStore: any = {
    isOrgAdmin: JSON.stringify(true),
  };

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ChangePasswordComponent],
      providers: [
        AuthService,
        Location,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required fields', () => {
    const formGroup = component.formGroup;
    expect(formGroup.get('currentPassword')).toBeTruthy();
    expect(formGroup.get('newPassword')).toBeTruthy();
    expect(formGroup.get('confirmPassword')).toBeTruthy();
  });

  it('should navigate to previous location on cancel button click', () => {
    const locationSpy = spyOn(location, 'back');
    component.onCancelClick('Cancel');
    expect(locationSpy).toHaveBeenCalled();
  });
});
