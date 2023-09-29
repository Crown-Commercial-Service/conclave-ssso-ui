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
  let routerSpy: jest.Mocked<Router>;
  let wrapperBuyerBothServiceSpy: jest.Mocked<WrapperBuyerBothService>;
  let wrapperOrganisationGroupServiceSpy: jest.Mocked<WrapperOrganisationGroupService>;
  let ciiServiceSpy: jest.Mocked<ciiService>;
  let sharedDataServiceSpy: jest.Mocked<SharedDataService>;
  let translateServiceSpy: jest.Mocked<TranslateService>;

  beforeEach(async () => {
    const routerSpyObj = {
      navigateByUrl: jest.fn(),
    };
    const wrapperBuyerBothServiceSpyObj = {
      getpendingVerificationOrg: jest.fn(),
      getVerifiedOrg: jest.fn(),
    };
    const wrapperOrganisationGroupServiceSpyObj = {
      getUsersAdmin: jest.fn(),
    };
    const ciiServiceSpyObj = {
      getSchemes: jest.fn(),
      getOrgDetails: jest.fn(),
    };
    const sharedDataServiceSpyObj = {
      getId: jest.fn(),
    };
    const translateServiceSpyObj = {
      get: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ViewVerifiedOrgComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: { subscribe: jest.fn() } },
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
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
    wrapperBuyerBothServiceSpy = TestBed.inject(
      WrapperBuyerBothService
    ) as jest.Mocked<WrapperBuyerBothService>;
    wrapperOrganisationGroupServiceSpy = TestBed.inject(
      WrapperOrganisationGroupService
    ) as jest.Mocked<WrapperOrganisationGroupService>;
    ciiServiceSpy = TestBed.inject(ciiService) as jest.Mocked<ciiService>;
    sharedDataServiceSpy = TestBed.inject(
      SharedDataService
    ) as jest.Mocked<SharedDataService>;
    translateServiceSpy = TestBed.inject(
      TranslateService
    ) as jest.Mocked<TranslateService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getPendingVerificationOrg method', () => {
      jest.spyOn(component, 'getPendingVerificationOrg');
      component.ngOnInit();
      expect(component.getPendingVerificationOrg).toHaveBeenCalled();
    });
  });

  describe('getPendingVerificationOrg', () => {
    it('should call getpendingVerificationOrg method of WrapperBuyerBothService', () => {
      wrapperBuyerBothServiceSpy.getpendingVerificationOrg.mockImplementation({
        subscribe: jest.fn(),
      });
      component.getPendingVerificationOrg();
      expect(
        wrapperBuyerBothServiceSpy.getpendingVerificationOrg
      ).toHaveBeenCalled();
    });
  });

  describe('getVerifiedOrg', () => {
    it('should call getVerifiedOrg method of WrapperBuyerBothService', () => {
      wrapperBuyerBothServiceSpy.getVerifiedOrg.mockReturnValue({
        subscribe: jest.fn(),
      });
      component.getVerifiedOrg();
      expect(wrapperBuyerBothServiceSpy.getVerifiedOrg).toHaveBeenCalled();
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
