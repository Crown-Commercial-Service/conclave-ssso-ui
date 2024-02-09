import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperOrganisationGroupService } from './wrapper-org--group-service';
import { environment } from 'src/environments/environment';
import {
  GroupList,
  OrganisationGroupNameInfo,
  OrganisationGroupRequestInfo,
  OrganisationGroupResponseInfo,
  Role,
} from 'src/app/models/organisationGroup';
import {
  IdentityProvider,
  IdentityProviderSummary,
} from 'src/app/models/identityProvider';
import { UserListResponse } from 'src/app/models/user';

describe('WrapperOrganisationGroupService', () => {
  let service: WrapperOrganisationGroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperOrganisationGroupService],
    });
    service = TestBed.inject(WrapperOrganisationGroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create organisation groups', () => {
    const organisationId = '123';
    const orgGroupNameInfo: OrganisationGroupNameInfo = {
      groupName: 'Group 1',
    };
    const expectedResult = 123;

    service
      .createOrganisationGroups(organisationId, orgGroupNameInfo)
      .subscribe((result) => {
        expect(result).toEqual(expectedResult);
      });

    const url = `${
      environment.uri.api.isApiGateWayEnabled
        ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
        : environment.uri.api.wrapper.apiGatewayDisabled.organisation
    }/${organisationId}/groups`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResult);
  });
});
