import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MFAResetComponent } from './mfa-reset-component';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';

describe('MFAResetComponent', () => {
  let component: MFAResetComponent;
  let fixture: ComponentFixture<MFAResetComponent>;
  let mockRouter: Router;
  let mockActivatedRoute: ActivatedRoute;
  let mockMFAService: MFAService;
  let mockAuthService: AuthService;
  let mockTitleService: Title;
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MFAResetComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ t: 'mock-token' }) },
        },
        {
          provide: MFAService,
          useValue: { resetMFA: () => Promise.resolve() },
        },
        { provide: AuthService, useValue: { logOutAndRedirect: () => {} } },
        { provide: Title, useValue: { setTitle: () => {} } },
        
        provideMockStore({
          initialState: {}, 
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
          },
        },
        
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MFAResetComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
    mockMFAService = TestBed.inject(MFAService);
    mockAuthService = TestBed.inject(AuthService);
    mockTitleService = TestBed.inject(Title);
    spyOn(mockRouter, 'navigateByUrl');
    spyOn(mockAuthService, 'logOutAndRedirect');
    spyOn(mockTitleService, 'setTitle');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onNavigateLinkClick', () => {
    it('should call logOutAndRedirect method of AuthService', () => {
      component.onNavigateLinkClick();
      expect(mockAuthService.logOutAndRedirect).toHaveBeenCalled();
    });
  });
});
