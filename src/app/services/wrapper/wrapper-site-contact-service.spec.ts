import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperSiteContactService } from './wrapper-site-contact-service';
import { environment } from 'src/environments/environment';
import {
  ContactAssignmentInfo,
  ContactPoint,
  SiteContactInfo,
  SiteContactInfoList,
} from 'src/app/models/contactInfo';
import { ContactAssignedStatus } from 'src/app/constants/enum';

describe('WrapperSiteContactService', () => {
  let service: WrapperSiteContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperSiteContactService],
    });
    service = TestBed.inject(WrapperSiteContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should assign site contact', () => {
    const organisationId = '123';
    const siteId = 1;
    const contactInfo: ContactAssignmentInfo = {
      assigningContactType: 0,
      assigningContactPointIds: [1, 2, 3],
    };
    const expectedResponse = [1, 2, 3];

    service
      .assignSiteContact(organisationId, siteId, contactInfo)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.contact
        : environment.uri.api.wrapper.apiGatewayDisabled.contact
    }/organisations/${organisationId}/sites/${siteId}/contacts/assignment`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should create site contact', () => {
    const organisationId = '123';
    const siteId = 1;
    const contactInfo: ContactPoint = {
      contacts: [
        {
          contactType: 'type',
          contactValue: 'value',
        },
      ],
    };
    const expectedResponse = 1;

    service
      .createSiteContact(organisationId, siteId, contactInfo)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.contact
        : environment.uri.api.wrapper.apiGatewayDisabled.contact
    }/organisations/${organisationId}/sites/${siteId}/contacts`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should delete site contact', () => {
    const organisationId = '123';
    const siteId = 1;
    const contactId = 1;

    service
      .deleteSiteContact(organisationId, siteId, contactId)
      .subscribe((response) => {
        expect(response).toBeTruthy();
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.contact
        : environment.uri.api.wrapper.apiGatewayDisabled.contact
    }/organisations/${organisationId}/sites/${siteId}/contacts/${contactId}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get site contacts', () => {
    const organisationId = '123';
    const siteId = 1;
    const contactAssignedStatus = ContactAssignedStatus.all;
    const expectedResponse: SiteContactInfoList = {
      organisationId,
      siteId,
      contactPoints: [
        {
          contacts: [
            {
              contactType: 'type',
              contactValue: 'value',
            },
          ],
        },
      ],
    };

    service
      .getSiteContacts(organisationId, siteId, contactAssignedStatus)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.contact
        : environment.uri.api.wrapper.apiGatewayDisabled.contact
    }/organisations/${organisationId}/sites/${siteId}/contacts?contact-assigned-status=${contactAssignedStatus}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should get site contact by id', () => {
    const organisationId = '123';
    const siteId = 1;
    const contactId = 1;
    const expectedResponse: SiteContactInfo = {
      detail: {
        organisationId,
        siteId,
      },
      contacts: [
        {
          contactType: 'type',
          contactValue: 'value',
        },
      ],
    };

    service
      .getSiteContactById(organisationId, siteId, contactId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.contact
        : environment.uri.api.wrapper.apiGatewayDisabled.contact
    }/organisations/${organisationId}/sites/${siteId}/contacts/${contactId}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should update site contact', () => {
    const organisationId = '123';
    const siteId = 1;
    const contactId = 1;
    const contactInfo: ContactPoint = {
      contacts: [
        {
          contactType: 'type',
          contactValue: 'value',
        },
      ],
    };

    service
      .updateSiteContact(organisationId, siteId, contactId, contactInfo)
      .subscribe((response) => {
        expect(response).toBeTruthy();
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.contact
        : environment.uri.api.wrapper.apiGatewayDisabled.contact
    }/organisations/${organisationId}/sites/${siteId}/contacts/${contactId}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
