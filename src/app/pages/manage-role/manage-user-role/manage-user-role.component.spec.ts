import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageUserRoleComponent } from './manage-user-role.component';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { of, throwError } from 'rxjs';

describe('ManageUserRoleComponent', () => {
  let component: ManageUserRoleComponent;
  let fixture: ComponentFixture<ManageUserRoleComponent>;
  let wrapperUserService: jasmine.SpyObj<WrapperUserService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    const wrapperUserServiceSpy = jasmine.createSpyObj('WrapperUserService', [
      'userTokenVerify',
      'acceptRejectRequest',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({ token: 'encryptedToken' }),
    });

    TestBed.configureTestingModule({
      declarations: [ManageUserRoleComponent],
      providers: [
        { provide: WrapperUserService, useValue: wrapperUserServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUserRoleComponent);
    component = fixture.componentInstance;
    wrapperUserService = TestBed.inject(
      WrapperUserService
    ) as jasmine.SpyObj<WrapperUserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set tokenPara and call verifytoken', () => {
      const token = 'encryptedToken';
      const userDetails = {
        detail: {
          id: 1,
          canChangePassword: true,
        },
        userName: 'test user',
        organisationId: 'test org',
        title: 'test title',
        firstName: 'test',
        lastName: 'user',
        mfaEnabled: false,
        isAdminUser: false,
      };
      wrapperUserService.userTokenVerify.and.returnValue(of(userDetails));

      component.ngOnInit();

      expect(component.tokenPara).toEqual(token);
      expect(wrapperUserService.userTokenVerify).toHaveBeenCalledWith(token);
    });
  });

  describe('verifytoken', () => {
    it('should set userDetails on successful verification', () => {
      const encryptedToken = 'encryptedToken';
      const userDetails = {
        detail: {
          id: 1,
          canChangePassword: true,
        },
        userName: 'test user',
        organisationId: 'test org',
        title: 'test title',
        firstName: 'test',
        lastName: 'user',
        mfaEnabled: false,
        isAdminUser: false,
      };
      wrapperUserService.userTokenVerify.and.returnValue(of(userDetails));

      component.verifytoken(encryptedToken);

      expect(component.userDetails).toEqual(userDetails);
      expect(component.errorResponce).toBeFalsy();
    });

    it('should set errorResponce on verification error', () => {
      const encryptedToken = 'encryptedToken';
      wrapperUserService.userTokenVerify.and.returnValue(throwError('Error'));

      component.verifytoken(encryptedToken);

      expect(component.errorResponce).toBeTruthy();
    });
  });

  describe('acceptRejectRequest', () => {
    it('should handle request acceptance', () => {
      const response = 1;
      const roleListResponse = {};
      const userDetails = {
        detail: {
          id: 1,
          canChangePassword: true,
        },
        userName: 'test user',
        organisationId: 'test org',
        title: 'test title',
        firstName: 'test',
        lastName: 'user',
        mfaEnabled: false,
        isAdminUser: false,
        id: 1,
      };
      component.userDetails = { id: 1, status: 0 };
      wrapperUserService.userTokenVerify.and.returnValue(of(userDetails));
      wrapperUserService.acceptRejectRequest.and.returnValue(
        of(roleListResponse)
      );

      component.acceptRejectRequest(response);

      expect(component.userDetails).toEqual(userDetails);
      expect(wrapperUserService.acceptRejectRequest).toHaveBeenCalledWith({
        pendingRoleIds: [1],
        status: response,
      });
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'manage-users/role/success?data=' +
          btoa(JSON.stringify(component.userDetails))
      );
    });

    it('should handle request rejection', () => {
      const response = 2;
      component.userDetails = { id: 1, status: 0 };
      const userDetails = {
        detail: {
          id: 1,
          canChangePassword: true,
        },
        userName: 'test user',
        organisationId: 'test org',
        title: 'test title',
        firstName: 'test',
        lastName: 'user',
        mfaEnabled: false,
        isAdminUser: false,
        id: 1,
      };
      wrapperUserService.userTokenVerify.and.returnValue(of(userDetails));
      wrapperUserService.acceptRejectRequest.and.returnValue(
        throwError('Test error')
      );

      component.acceptRejectRequest(response);

      expect(component.userDetails).toEqual(userDetails);
      expect(wrapperUserService.acceptRejectRequest).toHaveBeenCalledWith({
        pendingRoleIds: [1],
        status: response,
      });
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'manage-users/role/failed?data=' +
          btoa(JSON.stringify(component.userDetails))
      );
    });
  });
});
