import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BulkUploadService } from './bulk-upload.service';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';

describe('BulkUploadService', () => {
  let service: BulkUploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BulkUploadService],
    });
    service = TestBed.inject(BulkUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should upload a file', () => {
    const organisationId = '123';
    const fileToUpload = new File([], 'test.csv');

    service
      .uploadFile(organisationId, fileToUpload)
      .subscribe((response: BulkUploadResponse) => {
        expect(response).toBeTruthy();
      });

    const req = httpMock.expectOne(`${service.url}/${organisationId}/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('multipart/form-data');

    req.flush({});
  });

  it('should check bulk upload status', () => {
    const organisationId = '123';
    const id = '456';

    service
      .checkBulkUploadStatus(organisationId, id)
      .subscribe((response: BulkUploadResponse) => {
        expect(response).toBeTruthy();
      });

    const req = httpMock.expectOne(
      `${service.url}/${organisationId}/upload-status?id=${id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush({});
  });
});
