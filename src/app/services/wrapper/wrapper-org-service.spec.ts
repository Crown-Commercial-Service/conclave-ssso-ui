import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperOrganisationService } from './wrapper-org-service';
import { OrganisationDto } from 'src/app/models/organisation';
import { UserListResponse } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

describe('WrapperOrganisationService', () => {
  let service: WrapperOrganisationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperOrganisationService],
    });
    service = TestBed.inject(WrapperOrganisationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get organisation by id', () => {
    const orgId = '123';
    const expectedOrg: OrganisationDto = {};
    service.getOrganisation(orgId).subscribe((org) => {
      expect(org).toEqual(expectedOrg);
    });
    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
          : environment.uri.api.wrapper.apiGatewayDisabled.organisation
      }/${orgId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedOrg);
  });

  it('should get users by organisation id, search string, and pagination', () => {
    const orgId = '123';
    const searchString = 'test';
    const currentPage = 1;
    const pageSize = 10;
    const includeSelf = false;
    const expectedUsers: UserListResponse = {
      organisationId: '123',
      userList: [
        { name: 'Test User 1', userName: 'test username 1', isAdmin: false },
        { name: 'Test User 2', userName: 'test username 2', isAdmin: false },
      ],
      currentPage,
      pageCount: 3,
      rowCount: 28,
    };
    service
      .getUsers(orgId, searchString, currentPage, pageSize, includeSelf)
      .subscribe((users) => {
        expect(users).toEqual(expectedUsers);
      });
    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
          : environment.uri.api.wrapper.apiGatewayDisabled.organisation
      }/${orgId}/users?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(
        searchString
      )}&include-self=${includeSelf}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedUsers);
  });

  it('should update organisation roles', () => {
    const orgId = '123';
    const json = '{"roles": ["admin"]}';
    const type = 'roles';
    const expectedResponse = { success: true };
    service.updateOrgRoles(orgId, json, type).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });
    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
          : environment.uri.api.wrapper.apiGatewayDisabled.organisation
      }/${orgId}/${type}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(expectedResponse);
  });

  it('should get auto-validation status by organisation id', () => {
    const orgId = '123';
    const expectedOrg: OrganisationDto = {};
    service.getAutoValidationStatus(orgId).subscribe((org) => {
      expect(org).toEqual(expectedOrg);
    });
    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
          : environment.uri.api.wrapper.apiGatewayDisabled.organisation
      }/${orgId}/validation/auto`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedOrg);
  });
});
