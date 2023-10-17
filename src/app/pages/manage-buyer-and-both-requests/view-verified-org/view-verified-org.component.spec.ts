import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ViewVerifiedOrgComponent } from './view-verified-org.component';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { ciiService } from 'src/app/services/cii/cii.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { HelperService } from 'src/app/shared/helper.service';

describe('ViewVerifiedOrgComponent', () => {
  let component: ViewVerifiedOrgComponent;
  let fixture: ComponentFixture<ViewVerifiedOrgComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let wrapperBuyerBothServiceSpy: jasmine.SpyObj<WrapperBuyerBothService>;
  let wrapperOrganisationGroupServiceSpy: jasmine.SpyObj<WrapperOrganisationGroupService>;
  let ciiServiceSpy: jasmine.SpyObj<ciiService>;
  let sharedDataServiceSpy: jasmine.SpyObj<SharedDataService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const wrapperBuyerBothServiceSpyObj = jasmine.createSpyObj(
      'WrapperBuyerBothService',
      ['getpendingVerificationOrg', 'getVerifiedOrg']
    );
    const wrapperOrganisationGroupServiceSpyObj = jasmine.createSpyObj(
      'WrapperOrganisationGroupService',
      ['getUsersAdmin']
    );
    const ciiServiceSpyObj = jasmine.createSpyObj('ciiService', [
      'getSchemes',
      'getOrgDetails',
    ]);
    const sharedDataServiceSpyObj = jasmine.createSpyObj('SharedDataService', [
      'getId',
    ]);
    const translateServiceSpyObj = jasmine.createSpyObj('TranslateService', [
      'get',
    ]);
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) },
    });

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ViewVerifiedOrgComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useFactory: activatedRouteStub,
        },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: WrapperBuyerBothService,
          useValue: wrapperBuyerBothServiceSpyObj,
        },
        {
          provide: WrapperOrganisationGroupService,
          useValue: wrapperOrganisationGroupServiceSpyObj,
        },
        { provide: ciiService, useValue: ciiServiceSpyObj },
        { provide: SharedDataService, useValue: sharedDataServiceSpyObj },
        { provide: HelperService, useClass: HelperService },
        { provide: TranslateService, useValue: translateServiceSpyObj },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVerifiedOrgComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    wrapperBuyerBothServiceSpy = TestBed.inject(
      WrapperBuyerBothService
    ) as jasmine.SpyObj<WrapperBuyerBothService>;
    wrapperOrganisationGroupServiceSpy = TestBed.inject(
      WrapperOrganisationGroupService
    ) as jasmine.SpyObj<WrapperOrganisationGroupService>;
    ciiServiceSpy = TestBed.inject(ciiService) as jasmine.SpyObj<ciiService>;
    sharedDataServiceSpy = TestBed.inject(
      SharedDataService
    ) as jasmine.SpyObj<SharedDataService>;
    translateServiceSpy = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getPendingVerificationOrg method', () => {
      spyOn(component, 'getPendingVerificationOrg');
      component.ngOnInit();
      expect(component.getPendingVerificationOrg).toHaveBeenCalled();
    });
  });

  describe('goBack', () => {
    it('should navigate to "manage-buyer-both" if lastRoute is "pending-verification"', () => {
      component.routeDetails = { lastRoute: 'pending-verification' };
      component.goBack();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('manage-buyer-both');
    });

    it('should navigate back in history if lastRoute is not "pending-verification"', () => {
      component.routeDetails = { lastRoute: 'some-other-route' };
      component.goBack();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
