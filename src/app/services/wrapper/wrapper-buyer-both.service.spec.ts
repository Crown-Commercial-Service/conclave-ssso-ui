import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperBuyerBothService } from './wrapper-buyer-both.service';
import {
  OrganisationAuditListResponse,
  OrganisationAuditEventListResponse,
  OrganisationAuditList,
} from 'src/app/models/organisation';
import { environment } from 'src/environments/environment';

describe('WrapperBuyerBothService', () => {
  let service: WrapperBuyerBothService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperBuyerBothService],
    });
    service = TestBed.inject(WrapperBuyerBothService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve pending verification organizations', () => {
    const organisationId = '123';
    const searchString = 'example';
    const currentPage = 1;
    const pageSize = 10;
    const includeSelf = false;

    const organisationAuditList: OrganisationAuditList = {
      organisationId: 1,
      organisationName: 'org 1',
      organisationType: 1,
      organisationTypeName: 'type 1',
      dateOfRegistration: new Date(),
      rightToBuy: true,
    };

    const responseData: OrganisationAuditListResponse = {
      organisationAuditList: [organisationAuditList],
      currentPage: 1,
      pageCount: 3,
      rowCount: 27,
    };

    service
      .getpendingVerificationOrg(
        organisationId,
        searchString,
        currentPage,
        pageSize,
        includeSelf
      )
      .subscribe((data) => {
        expect(data).toEqual(responseData);
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
        : environment.uri.api.wrapper.apiGatewayDisabled.organisation
    }/audits?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(
      searchString
    )}&pending-only=true`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should retrieve verified organizations', () => {
    const organisationId = '123';
    const searchString = 'example';
    const currentPage = 1;
    const pageSize = 10;
    const includeSelf = false;

    const organisationAuditList: OrganisationAuditList = {
      organisationId: 1,
      organisationName: 'org 1',
      organisationType: 1,
      organisationTypeName: 'type 1',
      dateOfRegistration: new Date(),
      rightToBuy: true,
    };

    const responseData: OrganisationAuditListResponse = {
      organisationAuditList: [organisationAuditList],
      currentPage: 1,
      pageCount: 3,
      rowCount: 27,
    };

    service
      .getVerifiedOrg(
        organisationId,
        searchString,
        currentPage,
        pageSize,
        includeSelf
      )
      .subscribe((data) => {
        expect(data).toEqual(responseData);
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
        : environment.uri.api.wrapper.apiGatewayDisabled.organisation
    }/audits?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(
      searchString
    )}&pending-only=false`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should retrieve organization event logs', () => {
    const organisationId = '123';
    const currentPage = 1;
    const pageSize = 10;

    const organisationAuditList: OrganisationAuditList = {
      organisationId: 1,
      organisationName: 'org 1',
      organisationType: 1,
      organisationTypeName: 'type 1',
      dateOfRegistration: new Date(),
      rightToBuy: true,
    };

    const responseData: OrganisationAuditListResponse = {
      organisationAuditList: [organisationAuditList],
      currentPage: 1,
      pageCount: 3,
      rowCount: 27,
    };

    service
      .getOrgEventLogs(organisationId, currentPage, pageSize)
      .subscribe((data) => {
        expect(data).toEqual(responseData);
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
        : environment.uri.api.wrapper.apiGatewayDisabled.organisation
    }/${organisationId}/audit-events/service-role-groups?currentPage=${currentPage}&pageSize=${pageSize}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should perform manual validation', () => {
    const status = 1;
    const organisationId = '123';

    const organisationAuditList: OrganisationAuditList = {
      organisationId: 1,
      organisationName: 'org 1',
      organisationType: 1,
      organisationTypeName: 'type 1',
      dateOfRegistration: new Date(),
      rightToBuy: true,
    };

    const responseData: OrganisationAuditListResponse = {
      organisationAuditList: [organisationAuditList],
      currentPage: 1,
      pageCount: 3,
      rowCount: 27,
    };

    service.manualValidation(organisationId, status).subscribe((data) => {
      expect(data).toEqual(responseData);
    });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
        : environment.uri.api.wrapper.apiGatewayDisabled.organisation
    }/${organisationId}/validation/manual?status=${status}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(responseData);
  });
});
