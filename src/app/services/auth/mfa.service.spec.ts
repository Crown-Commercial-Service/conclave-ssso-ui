import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MFAService } from './mfa.service';
import { environment } from 'src/environments/environment';

describe('MFAService', () => {
  let service: MFAService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MFAService],
    });
    service = TestBed.inject(MFAService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send reset MFA notification', () => {
    const userName = 'testUser';

    service.sendResetMFANotification(userName).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.uri.api.postgres}/authorization/mfa-reset-notifications`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ UserName: userName });

    req.flush({});
  });

  it('should reset MFA', () => {
    const ticket = 'testTicket';

    service.resetMFA(ticket).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.uri.api.postgres}/authorization/mfa-reset-by-tickets`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ ticket: ticket });

    req.flush({});
  });

  it('should send reset MFA notification by admin', () => {
    const userName = 'testUser';

    service.sendResetMFANotificationByAdmin(userName).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.uri.api.postgres}/authorization/mfa-reset-notification-by-admins`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ UserName: userName });

    req.flush({});
  });
});
