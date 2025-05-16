import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { OrganisationService } from './organisation.service';
import { OrganisationSearchDto } from 'src/app/models/organisation';
import { environment } from 'src/environments/environment';

describe('OrganisationService', () => {
  let service: OrganisationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrganisationService],
    });
    service = TestBed.inject(OrganisationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get organisations by name', () => {
    const orgName = 'example';
    const isExact = true;
    const expectedData: OrganisationSearchDto[] = [
      {
        organisationId: '1',
        ciiOrganisationId: '1',
        organisationUri: 'org1',
        legalName: 'organization 1',
      },
      {
        organisationId: '2',
        ciiOrganisationId: '2',
        organisationUri: 'org2',
        legalName: 'organization 2',
      },
    ];

    service.getByName(orgName, isExact).subscribe((data) => {
      expect(data).toEqual(expectedData);
    });

    const url = `${
      environment.uri.api.postgres
    }/organisations/orgs-by-name?organisation-name=${encodeURIComponent(
      orgName
    )}&exact-match=${isExact}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(expectedData);
  });

  it('should get organisation by ID', () => {
    const orgId = '1';
    const expectedData = { id: '1', name: 'Example Org' };

    service.getById(orgId).subscribe((data) => {
      expect(data).toEqual(expectedData);
    });

    const url = `${environment.uri.api.postgres}/organisations/${orgId}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(expectedData);
  });
});
