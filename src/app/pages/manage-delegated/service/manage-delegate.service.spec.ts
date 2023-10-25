import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ManageDelegateService } from './manage-delegate.service';

describe('ManageDelegateService', () => {
  let service: ManageDelegateService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const org = 'exampleOrg';
  let localStore: any = {
    delegatedOrg: org,
    permission_organisation_id: org,
    show_loading_indicator: 'true',
  };

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    const authServiceMock = jasmine.createSpyObj('AuthService', [
      'renewAccessToken',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ManageDelegateService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(ManageDelegateService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set delegatedOrg and call renewAccessToken method', () => {
    const page = 'examplePage';

    service.setDelegatedOrg(org, page);

    expect(localStorage.getItem('delegatedOrg')).toBe(org);
    expect(authServiceSpy.renewAccessToken).toHaveBeenCalledWith(page);
    expect(localStorage.getItem('show_loading_indicator')).toBe('true');
  });

  it('should set permission_organisation_id based on delegatedOrg value', () => {
    const org = 'exampleOrg';
    service.delegatedOrg.next(org);
    service.setPermissionOrgDetails();
    expect(localStorage.getItem('permission_organisation_id')).toBe(org);
  });
});
