import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ciiService } from './cii.service';
import { environment } from '../../../environments/environment';

describe('ciiService', () => {
  let service: ciiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ciiService],
    });
    service = TestBed.inject(ciiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSchemes', () => {
    it('should make a GET request to retrieve schemes', () => {
      const mockResponse = [{ name: 'Scheme 1' }, { name: 'Scheme 2' }];
      service.getSchemes().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.uri.api.postgres}/cii/schemes`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getIdentifierDetails', () => {
    it('should make a GET request to retrieve identifier details', () => {
      const mockScheme = 'GB-COH';
      const mockId = '123456789';
      const mockResponse = {
        scheme: mockScheme,
        id: mockId,
        details: 'Identifier Details',
      };
      service.getIdentifierDetails(mockScheme, mockId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${
          environment.uri.api.postgres
        }/cii/identifiers?scheme=${mockScheme}&identifier=${encodeURIComponent(
          mockId
        )}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
