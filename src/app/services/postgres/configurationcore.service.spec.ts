import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
} from '@angular/common/http/testing';
import { ConfigurationCore } from './configurationcore.service';
import { ContryDetails } from 'src/app/models/contryDetails';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ConfigurationCore', () => {
  let service: ConfigurationCore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfigurationCore],
    });
    service = TestBed.inject(ConfigurationCore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCountryDetails', () => {
    it('should return an Observable<ContryDetails[]>', () => {
      const mockData: ContryDetails[] = [
        { id: 1, countryName: 'UK', countryCode: '1' },
        { id: 2, countryName: 'India', countryCode: '2' },
      ];

      service.getCountryDetails().subscribe((data: ContryDetails[]) => {
        expect(data.length).toBe(2);
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${service.url}/country-details`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle errors', () => {
      const mockError = { message: 'Error fetching country details' };

      service.getCountryDetails().subscribe(
        () => {},
        (error) => {
          
        }
      );

      const req = httpMock.expectOne(`${service.url}/country-details`);
      expect(req.request.method).toBe('GET');
      req.flush(mockError, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
