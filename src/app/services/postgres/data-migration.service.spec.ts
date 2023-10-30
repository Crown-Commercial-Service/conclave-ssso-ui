import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DataMigrationService } from './data-migration.service';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';
import { dataMigrationReportDetailsResponce } from 'src/app/models/data-migration.model';
import { environment } from 'src/environments/environment';

describe('DataMigrationService', () => {
  let service: DataMigrationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataMigrationService],
    });
    service = TestBed.inject(DataMigrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should upload data migration file', () => {
    const mockFile = new File(['dummy content'], 'test-file.csv');
    const mockResponse: dataMigrationReportDetailsResponce = {
      id: '1',
      dataMigrationStatus: 1,
      errorDetails: [],
      dataMigrationMigrationReportDetails: 'details',
    };

    service.uploadDataMigrationFile(mockFile).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
          : environment.uri.api.wrapper.apiGatewayDisabled.organisation
      }/migrations/upload`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('multipart/form-data');

    req.flush(mockResponse);
  });

  it('should get data migration file details', () => {
    const mockPageSize = 10;
    const mockCurrentPage = 1;
    const mockResponse: any = {};

    service
      .getDataMigrationFileDetails(mockPageSize, mockCurrentPage)
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
          : environment.uri.api.wrapper.apiGatewayDisabled.organisation
      }/migrations/files?PageSize=${mockPageSize}&CurrentPage=${mockCurrentPage}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get data migration file status by id', () => {
    const mockId = '123';
    const mockResponse: any = {};

    service.getDataMigrationFileStatusById(mockId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${
        environment.uri.api.isApiGateWayEnabled
          ? environment.uri.api.wrapper.apiGatewayEnabled.organisation
          : environment.uri.api.wrapper.apiGatewayDisabled.organisation
      }/migrations/status?id=${mockId}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
