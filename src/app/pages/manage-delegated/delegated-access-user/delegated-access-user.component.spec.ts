import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelegatedAccessUserComponent } from './delegated-access-user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../../services/auth/auth.service';
import { RollbarErrorService } from '../../../shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from '../../../logging/rollbar';
import { TokenService } from '../../../services/auth/token.service';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedAccessUserComponent', () => {
  let component: DelegatedAccessUserComponent;
  let fixture: ComponentFixture<DelegatedAccessUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelegatedAccessUserComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedAccessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user details correctly', () => {
    component.userDetails = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe@example.com',
      originOrganisationName: 'Example Org',
      mfaEnabled: true,
    };
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector(
      '.user-profile-container p:first-child strong'
    );
    const emailElement = fixture.nativeElement.querySelector(
      '.user-profile-container p:nth-child(2) strong'
    );
    const orgElement = fixture.nativeElement.querySelector(
      '.user-profile-container p:nth-child(3) strong'
    );
    const mfaElement = fixture.nativeElement.querySelector(
      '.govuk-details__text strong'
    );

    expect(nameElement.textContent).toContain('John Doe');
    expect(emailElement.textContent).toContain('johndoe@example.com');
    expect(orgElement.textContent).toContain('Example Org');
    expect(mfaElement.textContent).toContain('Enabled');
  });
});
