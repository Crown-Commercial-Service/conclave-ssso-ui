import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelegatedOrganisationComponent } from './delegated-organisation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { ManageDelegateService } from '../../service/manage-delegate.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedOrganisationComponent', () => {
  let component: DelegatedOrganisationComponent;
  let fixture: ComponentFixture<DelegatedOrganisationComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let delegatedServiceSpy: jasmine.SpyObj<WrapperUserDelegatedService>;
  let delegateServiceSpy: jasmine.SpyObj<ManageDelegateService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const delegatedServiceSpyObj = jasmine.createSpyObj(
      'WrapperUserDelegatedService',
      ['getDeligatedOrg']
    );
    const delegateServiceSpyObj = jasmine.createSpyObj(
      'ManageDelegateService',
      ['setDelegatedOrg']
    );
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) },
    });

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DelegatedOrganisationComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getDelegatedOrganisation', () => {
      spyOn(component, 'getDelegatedOrganisation');
      component.ngOnInit();

      expect(component.getDelegatedOrganisation).toHaveBeenCalled();
    });
  });

  describe('getDelegatedOrganisation', () => {
    it('should retrieve delegated organizations and set userDetails and organisationList', () => {
      delegatedServiceSpy.getDeligatedOrg.and.returnValue(
        of({
          detail: {
            delegatedOrgs: [
              { delegatedOrgId: 'org1' },
              { delegatedOrgId: 'org2' },
            ],
          },
        })
      );

      component.getDelegatedOrganisation();
      expect(component.userDetails).toBeDefined();
      expect(component.organisationList.length).toBe(2);
    });

    it('should set delegated organization to 0 and navigate to reload page if orgDetails is undefined', () => {
      delegatedServiceSpy.getDeligatedOrg.and.returnValue(
        of({
          detail: {
            delegatedOrgs: [
              { delegatedOrgId: 'org1' },
              { delegatedOrgId: 'org2' },
            ],
          },
        })
      );
      component.roleData = 'org1';
      component.roleInfo = 'org1';
      component.getDelegatedOrganisation();
      expect(delegateServiceSpy.setDelegatedOrg).toHaveBeenCalledWith(
        0,
        'delegated-organisation?data=reload'
      );
    });

    it('should not set delegated organization to 0 if orgDetails is undefined but roleData is already 0', () => {
      delegatedServiceSpy.getDeligatedOrg.and.returnValue(
        of({
          detail: {
            delegatedOrgs: [
              { delegatedOrgId: 'org1' },
              { delegatedOrgId: 'org2' },
            ],
          },
        })
      );
      component.roleData = 0;
      component.roleInfo = 'org1';
      component.getDelegatedOrganisation();
      expect(delegateServiceSpy.setDelegatedOrg).not.toHaveBeenCalled();
    });

    it('should retrieve delegated organizations and set userDetails and organisationList', () => {
      delegatedServiceSpy.getDeligatedOrg.and.returnValue(
        of({
          detail: {
            delegatedOrgs: [
              { delegatedOrgId: 'org1' },
              { delegatedOrgId: 'org2' },
            ],
          },
        })
      );

      component.getDelegatedOrganisation();
      expect(component.userDetails).toBeDefined();
      expect(component.organisationList.length).toBe(2);
    });
  });

  describe('setPrimaryOrg', () => {
    it('should reset secondaryRoleSelected and set roleInfo to 0', () => {
      component.secondaryRoleSelected = 'org2';
      component.roleInfo = 'org2';
      component.setPrimaryOrg();
      expect(component.secondaryRoleSelected).toBeNull();
      expect(component.roleInfo).toBe(0);
    });
  });

  describe('setSecondaryOrg', () => {
    it('should reset primaryRoleSelected and set roleInfo to orgDetails.delegatedOrgId', () => {
      const orgDetails = { delegatedOrgId: 'org2' };
      component.primaryRoleSelected = 'primaryselected';
      component.roleInfo = 0;
      component.setSecondaryOrg(orgDetails);
      expect(component.primaryRoleSelected).toBeNull();
      expect(component.roleInfo).toBe(orgDetails.delegatedOrgId);
    });
  });

  describe('onSubmit', () => {
    it('should call setDelegatedOrg with roleInfo and navigate to home', () => {
      component.roleInfo = 'org1';
      component.onSubmit('Switch organisations');
      expect(delegateServiceSpy.setDelegatedOrg).toHaveBeenCalledWith(
        'org1',
        'home'
      );
    });
  });

  describe('Cancel', () => {
    it('should navigate back in history', () => {
      spyOn(window.history, 'back');
      component.Cancel('Cancel');
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
