import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a POST request to resend user activation email', () => {
    const email = 'test@example.com';
    const isExpired = false;

    service
      .resendUserActivationEmail(email, isExpired)
      .subscribe((response) => {
        expect(response).toBeTruthy();
      });

    const req = httpMock.expectOne(
      `${service.url}/activation-emails?is-expired=${isExpired}&is-reg-user=false`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(`email=${encodeURIComponent(email)}`);

    const mockResponse = {};
    req.flush(mockResponse);
  });
});
