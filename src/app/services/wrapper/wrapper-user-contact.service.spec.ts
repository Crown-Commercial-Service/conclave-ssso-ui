import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperUserContactService } from './wrapper-user-contact.service';
import {
  ContactPoint,
  UserContactInfo,
  UserContactInfoList,
} from 'src/app/models/contactInfo';
import { environment } from 'src/environments/environment';

describe('WrapperUserContactService', () => {
  let service: WrapperUserContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperUserContactService],
    });
    service = TestBed.inject(WrapperUserContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a user contact', () => {
    const userName = 'testuser';
    const contactInfo: ContactPoint = {
      contacts: [
        {
          contactType: 'test type',
          contactValue: 'test value',
        },
      ],
    };
    const expectedResponse = 1;

    service.createUserContact(userName, contactInfo).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.contact
          : environment.uri.api.wrapper.apiGatewayDisabled.contact
      }/user/contacts?user-id=${encodeURIComponent(userName)}`
    );
    expect(req.request.method).toEqual('POST');
    req.flush(expectedResponse);
  });

  it('should delete a user contact', () => {
    const userName = 'testuser';
    const contactId = 1;

    service.deleteUserContact(userName, contactId).subscribe((response) => {
      expect(response).toEqual(true);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.contact
          : environment.uri.api.wrapper.apiGatewayDisabled.contact
      }/user/contacts/${contactId}?user-id=${encodeURIComponent(userName)}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should get user contacts', () => {
    const userName = 'testuser';
    const expectedResponse: UserContactInfoList = {
      userId: '123',
      organisationId: '123',
      contactPoints: [
        {
          contacts: [
            {
              contactType: 'test type',
              contactValue: 'test value',
            },
          ],
        },
      ],
    };

    service.getUserContacts(userName).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.contact
          : environment.uri.api.wrapper.apiGatewayDisabled.contact
      }/user/contacts?user-id=${encodeURIComponent(userName)}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
  });

  it('should get a user contact by ID', () => {
    const userName = 'testuser';
    const contactId = 1;
    const expectedResponse: UserContactInfo = {
      detail: {
        userId: '1',
        organisationId: '123',
      },
      contacts: [
        {
          contactType: 'test type',
          contactValue: 'test value',
        },
      ],
    };

    service.getUserContactById(userName, contactId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.contact
          : environment.uri.api.wrapper.apiGatewayDisabled.contact
      }/user/contacts/${contactId}?user-id=${encodeURIComponent(userName)}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
  });

  it('should update a user contact', () => {
    const userName = 'testuser';
    const contactId = 1;
    const contactInfo: ContactPoint = {
      contacts: [
        {
          contactType: 'test type',
          contactValue: 'test value',
        },
      ],
    };

    service
      .updateUserContact(userName, contactId, contactInfo)
      .subscribe((response) => {
        expect(response).toEqual(true);
      });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.contact
          : environment.uri.api.wrapper.apiGatewayDisabled.contact
      }/user/contacts/${contactId}?user-id=${encodeURIComponent(userName)}`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  });
});
