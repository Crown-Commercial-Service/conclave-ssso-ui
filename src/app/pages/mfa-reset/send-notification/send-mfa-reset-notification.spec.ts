import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
// import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { SendMFAResetNotificationComponent } from './send-mfa-reset-notification';
import { MFAService } from '../../../services/auth/mfa.service';
import { AuthService } from '../../../services/auth/auth.service';
import { RollbarErrorService } from '../../../shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from '../../../logging/rollbar';
import { TokenService } from '../../../services/auth/token.service';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('SendMFAResetNotificationComponent', () => {
  let component: SendMFAResetNotificationComponent;
  let fixture: ComponentFixture<SendMFAResetNotificationComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockStore: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({ u: '' }),
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    mockStore = {
      dispatch: jasmine.createSpy('dispatch'),
    };

    await TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot()],
      declarations: [SendMFAResetNotificationComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        // { provide: Store, useValue: mockStore },
        MFAService,
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
        provideMockStore({
          initialState: {}, 
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should initialize the component', () => {
    spyOn(component, 'onNavigateLinkClick');
    component.ngOnInit();

    expect(component.userName).toBe('');
  });
});
