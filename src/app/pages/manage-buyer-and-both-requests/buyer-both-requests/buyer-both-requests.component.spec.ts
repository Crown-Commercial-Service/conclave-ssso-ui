import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { BuyerBothRequestsComponent } from './buyer-both-requests.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('BuyerBothRequestsComponent', () => {
  let component: BuyerBothRequestsComponent;
  let fixture: ComponentFixture<BuyerBothRequestsComponent>;
  let wrapperBuyerBothService: WrapperBuyerBothService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerBothRequestsComponent],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        WrapperBuyerBothService, TranslateService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBothRequestsComponent);
    component = fixture.componentInstance;
    wrapperBuyerBothService = TestBed.inject(WrapperBuyerBothService);
    spyOn(window.HTMLElement.prototype, 'scrollIntoView');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPendingVerificationOrg on component initialization', () => {
    spyOn(component, 'getPendingVerificationOrg');
    component.ngOnInit();
    expect(component.getPendingVerificationOrg).toHaveBeenCalled();
  });

  it('should call getpendingVerificationOrg service method and update pendingVerificationBuyerAndBoth', () => {
    const orgListResponse = {
      currentPage: 1,
      pageCount: 2,
      organisationAuditList: [],
    };
    spyOn(wrapperBuyerBothService, 'getpendingVerificationOrg').and.returnValue(of(orgListResponse));
    component.getPendingVerificationOrg();
    expect(wrapperBuyerBothService.getpendingVerificationOrg).toHaveBeenCalled();
    expect(component.pendingVerificationBuyerAndBoth.organisationAuditList).toEqual(orgListResponse);
    expect(component.pendingVerificationBuyerAndBoth.pageCount).toEqual(orgListResponse.pageCount);
  });

  it('should call getVerifiedOrg service method and update verifiedBuyerAndBoth', () => {
    const orgListResponse = {
      currentPage: 1,
      pageCount: 2,
      organisationAuditList: [],
    };
    spyOn(wrapperBuyerBothService, 'getVerifiedOrg').and.returnValue(of(orgListResponse));
    component.geVerifiedOrg();
    expect(wrapperBuyerBothService.getVerifiedOrg).toHaveBeenCalled();
    expect(component.verifiedBuyerAndBoth.organisationAuditList).toEqual(orgListResponse);
    expect(component.verifiedBuyerAndBoth.pageCount).toEqual(orgListResponse.pageCount);
  });

  it('should call tabChanged method and update tabConfig', () => {
    component.tabChanged('verifiedOrg');
    expect(component.tabConfig.pendingOrg).toBeFalsy();
    expect(component.tabConfig.verifiedOrg).toBeTruthy();
  });
});