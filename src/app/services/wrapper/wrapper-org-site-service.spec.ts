import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperOrganisationSiteService } from './wrapper-org-site-service';
import {
  OrganisationSiteInfo,
  OrganisationSiteInfoList,
  OrganisationSiteResponse,
} from 'src/app/models/site';

describe('WrapperOrganisationSiteService', () => {
  let service: WrapperOrganisationSiteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperOrganisationSiteService],
    });
    service = TestBed.inject(WrapperOrganisationSiteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an organisation site', () => {
    const organisationId = '123';
    const orgSiteInfo: OrganisationSiteInfo = {
      siteName: 'test site',
      address: {},
    };
    const expectedResponse = 123;

    service
      .createOrganisationSite(organisationId, orgSiteInfo)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpMock.expectOne(`${service.url}/${organisationId}/sites`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should get organisation sites', () => {
    const organisationId = '123';
    const searchString = 'example';
    const expectedResponse: OrganisationSiteInfoList = {
      organisationId,
      sites: [{ details: { siteId: 1 }, siteName: 'test site', address: {} }],
    };

    service
      .getOrganisationSites(organisationId, searchString)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/sites?search-string=${searchString}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should get an organisation site', () => {
    const organisationId = '123';
    const siteId = 456;
    const expectedResponse: OrganisationSiteResponse = {
      organisationId,
      details: { siteId: 1 },
      siteName: 'test site',
      address: {},
    };

    service
      .getOrganisationSite(organisationId, siteId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/sites/${siteId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should update an organisation site', () => {
    const organisationId = '123';
    const siteId = 456;
    const orgSiteInfo: OrganisationSiteInfo = {
      siteName: 'test site',
      address: {},
    };

    service
      .updateOrganisationSite(organisationId, siteId, orgSiteInfo)
      .subscribe((response) => {
        expect(response).toBeTrue();
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/sites/${siteId}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete an organisation site', () => {
    const organisationId = '123';
    const siteId = 456;

    service
      .deleteOrganisationSite(organisationId, siteId)
      .subscribe((response) => {
        expect(response).toBeTrue();
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/sites/${siteId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
