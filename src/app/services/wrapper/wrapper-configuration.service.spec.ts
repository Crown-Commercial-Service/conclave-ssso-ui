import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperConfigurationService } from './wrapper-configuration.service';
import { environment } from 'src/environments/environment';

describe('WrapperConfigurationService', () => {
  let service: WrapperConfigurationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperConfigurationService],
    });
    service = TestBed.inject(WrapperConfigurationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve identity providers', () => {
    const dummyIdentityProviders: string[] = [];

    service.getIdentityProviders().subscribe((identityProviders) => {
      expect(identityProviders).toEqual(dummyIdentityProviders);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.configuration
          : environment.uri.api.wrapper.apiGatewayDisabled.configuration
      }/identity-providers`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyIdentityProviders);
  });

  it('should retrieve roles', () => {
    const dummyRoles: string[] = [];

    service.getRoles().subscribe((roles) => {
      expect(roles).toEqual(dummyRoles);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.configuration
          : environment.uri.api.wrapper.apiGatewayDisabled.configuration
      }/service-role-groups`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyRoles);
  });

  it('should retrieve country details', () => {
    const dummyCountryDetails = [
      {
        id: 1,
        countryName: 'UK',
        countryCode: '1',
      },
      {
        id: 2,
        countryName: 'India',
        countryCode: '2',
      },
    ];

    service.getCountryDetails().subscribe((countryDetails) => {
      expect(countryDetails).toEqual(dummyCountryDetails);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.configuration
          : environment.uri.api.wrapper.apiGatewayDisabled.configuration
      }/country-details`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyCountryDetails);
  });
});
