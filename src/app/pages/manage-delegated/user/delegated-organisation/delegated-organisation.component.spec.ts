import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { ManageDelegateService } from '../../service/manage-delegate.service';
import { DelegatedOrganisationComponent } from './delegated-organisation.component';

describe('DelegatedOrganisationComponent', () => {
  let component: DelegatedOrganisationComponent;
  let fixture: ComponentFixture<DelegatedOrganisationComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let delegatedServiceSpy: jasmine.SpyObj<WrapperUserDelegatedService>;
  let delegateServiceSpy: jasmine.SpyObj<ManageDelegateService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteSpyObj = jasmine.createSpyObj('ActivatedRoute', [
      'queryParams',
    ]);
    const delegatedServiceSpyObj = jasmine.createSpyObj(
      'WrapperUserDelegatedService',
      ['getDeligatedOrg']
    );
    const delegateServiceSpyObj = jasmine.createSpyObj(
      'ManageDelegateService',
      ['setDelegatedOrg']
    );

    await TestBed.configureTestingModule({
      declarations: [DelegatedOrganisationComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteSpyObj },
        {
          provide: WrapperUserDelegatedService,
          useValue: delegatedServiceSpyObj,
        },
        { provide: ManageDelegateService, useValue: delegateServiceSpyObj },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedOrganisationComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
    delegatedServiceSpy = TestBed.inject(
      WrapperUserDelegatedService
    ) as jasmine.SpyObj<WrapperUserDelegatedService>;
    delegateServiceSpy = TestBed.inject(
      ManageDelegateService
    ) as jasmine.SpyObj<ManageDelegateService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home if delegation is disabled', () => {
    component.ngOnInit();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('should set primaryRoleSelected and roleData to 0 when queryParams data is "reload"', () => {
    activatedRouteSpy.queryParams = { data: 'reload' };
    component.ngOnInit();
    expect(component.primaryRoleSelected).toBe('primaryselected');
    expect(component.roleData).toBe(0);
  });

  it('should set primaryRoleSelected and roleData to 0 if DelegateService.getDelegatedOrg is null', () => {
    delegateServiceSpy.getDelegatedOrg.and.returnValue(null);
    component.ngOnInit();
    expect(component.primaryRoleSelected).toBe('primaryselected');
    expect(component.roleData).toBe(0);
  });

  it('should set secondaryRoleSelected, roleInfo, and roleData to DelegateService.getDelegatedOrg', () => {
    const delegatedOrg = 'delegatedOrgId';
    delegateServiceSpy.getDelegatedOrg.and.returnValue(delegatedOrg);
    component.ngOnInit();
    expect(component.secondaryRoleSelected).toBe(delegatedOrg);
    expect(component.roleInfo).toBe(delegatedOrg);
    expect(component.roleData).toBe(delegatedOrg);
  });

  it('should call getDelegatedOrganisation method on ngOnInit', () => {
    spyOn(component, 'getDelegatedOrganisation');
    component.ngOnInit();
    expect(component.getDelegatedOrganisation).toHaveBeenCalled();
  });

  it('should disable the submit button if roleData is equal to roleInfo', () => {
    component.roleData = 'roleData';
    component.roleInfo = 'roleData';
    expect(component.isDisabled).toBeTrue();
  });

  it('should enable the submit button if roleData is not equal to roleInfo', () => {
    component.roleData = 'roleData';
    component.roleInfo = 'otherRoleData';
    expect(component.isDisabled).toBeFalse();
  });

  it('should call getDeligatedOrg method from delegatedService on getDelegatedOrganisation', () => {
    delegatedServiceSpy.getDeligatedOrg.and.returnValue({
      detail: { delegatedOrgs: [] },
    });
    component.getDelegatedOrganisation();
    expect(delegatedServiceSpy.getDeligatedOrg).toHaveBeenCalled();
  });

  it('should set delegatedOrg to 0 and navigate to "delegated-organisation?data=reload" if orgDetails is undefined and roleData is not 0', () => {
    const orgDetails = undefined;
    component.roleData = 'roleData';
    component.getDelegatedOrganisation();
    expect(delegateServiceSpy.setDelegatedOrg).toHaveBeenCalledWith(
      0,
      'delegated-organisation?data=reload'
    );
  });

  it('should set userDetails and organisationList from the response data', () => {
    const data = { detail: { delegatedOrgs: [{ delegatedOrgId: 'orgId' }] } };
    delegatedServiceSpy.getDeligatedOrg.and.returnValue(data);
    component.getDelegatedOrganisation();
    expect(component.userDetails).toBe(data);
    expect(component.organisationList).toBe(data.detail.delegatedOrgs);
  });

  it('should set secondaryRoleSelected to null and roleInfo to 0 on setPrimaryOrg method', () => {
    component.secondaryRoleSelected = 'secondaryRoleSelected';
    component.setPrimaryOrg();
    expect(component.secondaryRoleSelected).toBeNull();
    expect(component.roleInfo).toBe(0);
  });

  it('should set primaryRoleSelected to null and roleInfo to orgDetails.delegatedOrgId on setSecondaryOrg method', () => {
    const orgDetails = { delegatedOrgId: 'orgId' };
    component.primaryRoleSelected = 'primaryRoleSelected';
    component.setSecondaryOrg(orgDetails);
    expect(component.primaryRoleSelected).toBeNull();
    expect(component.roleInfo).toBe(orgDetails.delegatedOrgId);
  });

  it('should call setDelegatedOrg method from DelegateService on onSubmit', () => {
    const roleInfo = 'roleInfo';
    component.roleInfo = roleInfo;
    component.onSubmit();
    expect(delegateServiceSpy.setDelegatedOrg).toHaveBeenCalledWith(
      roleInfo,
      'home'
    );
  });

  it('should call window.history.back on Cancel', () => {
    spyOn(window.history, 'back');
    component.Cancel();
    expect(window.history.back).toHaveBeenCalled();
  });
});
