import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuditLoggerService } from './logger.service';
import { LogInfo } from 'src/app/models/logInfo';

describe('AuditLoggerService', () => {
  let service: AuditLoggerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditLoggerService],
    });
    service = TestBed.inject(AuditLoggerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to the correct URL', () => {
    const logInfo: LogInfo = {
      eventName: 'event',
      applicationName: 'app',
      referenceData: 'reference',
    };

    service.createLog(logInfo).subscribe();

    const req = httpMock.expectOne(`${service.url}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(logInfo);
    req.flush(null);
  });
});
