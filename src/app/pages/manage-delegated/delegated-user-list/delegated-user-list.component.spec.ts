import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelegatedUserListComponent } from './delegated-user-list.component';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { rollbarFactory, RollbarService } from 'src/app/logging/rollbar';
import { TokenService } from 'src/app/services/auth/token.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('DelegatedUserListComponent', () => {
  let component: DelegatedUserListComponent;
  let fixture: ComponentFixture<DelegatedUserListComponent>;
  let wrapperUserDelegatedService: WrapperUserDelegatedService;
  let localStore: any = {
    cii_organisation_id: 'test-org-id',
    activetab: 'test-active-tab',
  };
  let authService: AuthService;
  let mockTokenService: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    mockTokenService = jasmine.createSpyObj('TokenService', ['getCiiOrgId']);
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );
    spyOn(sessionStorage, 'getItem').withArgs('activetab').and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [DelegatedUserListComponent],
      providers: [WrapperUserDelegatedService, AuthService,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RollbarService, useValue: rollbarFactory() },
        { provide: TokenService, useValue: mockTokenService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserListComponent);
    component = fixture.componentInstance;
    wrapperUserDelegatedService = TestBed.inject(WrapperUserDelegatedService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.searchText).toEqual('');
    expect(component.searchSumbited).toBeFalse();
    expect(component.tabConfig.currentusers).toBeTrue();
    expect(component.tabConfig.expiredusers).toBeFalse();
    expect(component.organisationId).toEqual('test-org-id');
    expect(component.currentUserstableConfig.currentPage).toEqual(1);
  });

  it('should navigate to delegated-remove-confirm page on onLinkClick with "Remove" action', () => {
    spyOn(component.router, 'navigateByUrl');
    const data = {
      event: {
        target: {
          innerText: 'Remove',
        },
        userName: 'testUser',
      },
    };
    component.onLinkClick(data);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'delegated-remove-confirm?data=' + btoa(encodeURIComponent(JSON.stringify(data)))
    );
  });

  it('should navigate to delegate-access-user page on onLinkClick with "Edit" action', () => {
    spyOn(component.router, 'navigateByUrl');
    const data = {
      event: {
        target: {
          innerText: 'Edit',
        },
        userName: 'testUser',
      },
    };
    component.onLinkClick(data);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'delegate-access-user?data=' + btoa(encodeURIComponent(JSON.stringify(data)))
    );
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    spyOn(sessionStorage, 'removeItem');
    component.ngOnDestroy();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('activetab');
  });
});
