import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperOrganisationContactService } from './wrapper-org-contact-service';
import {
  ContactAssignmentInfo,
  ContactPoint,
  OrganisationContactInfoList,
} from 'src/app/models/contactInfo';

describe('WrapperOrganisationContactService', () => {
  let service: WrapperOrganisationContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperOrganisationContactService],
    });
    service = TestBed.inject(WrapperOrganisationContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should assign an organisation contact', () => {
    const organisationId = '123';
    const contactInfo: ContactAssignmentInfo = {
      assigningContactType: 0,
      assigningContactPointIds: [1, 2, 3],
    };
    const expectedResponse = [1, 2, 3];

    service
      .assignOrgContact(organisationId, contactInfo)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/contacts/assignment`
    );
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should create an organisation contact', () => {
    const organisationId = '123';
    const contactInfo: ContactPoint = {
      contacts: [
        {
          contactType: 'type1',
          contactValue: 'value1',
        },
      ],
    };
    const expectedResponse = 1;

    service
      .createOrganisationContact(organisationId, contactInfo)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpMock.expectOne(`${service.url}/${organisationId}/contacts`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should delete an organisation contact', () => {
    const organisationId = '123';
    const contactId = 1;

    service
      .deleteOrganisationContact(organisationId, contactId)
      .subscribe((response) => {
        expect(response).toBeTrue();
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/contacts/${contactId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get organisation contacts', () => {
    const organisationId = '123';
    const expectedResponse: OrganisationContactInfoList = {
      organisationId: organisationId,
      contactPoints: [
        {
          contacts: [
            {
              contactType: 'type1',
              contactValue: 'value1',
            },
          ],
        },
      ],
    };

    service.getOrganisationContacts(organisationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${service.url}/${organisationId}/contacts`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should get an organisation contact by ID', () => {
    const organisationId = '123';
    const contactId = 1;
    const expectedResponse = {
      id: 1,
      name: 'Test user',
      email: 'test@example.com',
    };

    service
      .getOrganisationContactById(organisationId, contactId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/contacts/${contactId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should update an organisation contact', () => {
    const organisationId = '123';
    const contactId = 1;
    const contactInfo: ContactPoint = {
      contacts: [
        {
          contactType: 'type1',
          contactValue: 'value1',
        },
      ],
    };

    service
      .updateOrganisationContact(organisationId, contactId, contactInfo)
      .subscribe((response) => {
        expect(response).toBeTrue();
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/contacts/${contactId}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
