import { TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
} from '@angular/common/http/testing';
import { JwtAuthService } from './jwt.auth.service';
import { JwtToken } from '../../models/jwtToken';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        JwtAuthService],
    });
    service = TestBed.inject(JwtAuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the JWT token from the server', () => {
    const mockToken: JwtToken = {
      token: 'mockToken',
      user: 'mockUser',
      validUntil: new Date(),
    };

    service.login().subscribe((token: JwtToken) => {
      expect(token.token).toEqual(mockToken.token);
      expect(token.user).toEqual(mockToken.user);
    });

    const req = httpMock.expectOne('http://localhost:44352/Security/login');
    expect(req.request.method).toBe('GET');
    req.flush(mockToken);
  });

  it('should refresh the JWT token', () => {
    const mockToken: JwtToken = {
      token: 'mockToken',
      user: 'mockUser',
      validUntil: new Date(),
    };

    service.refreshToken().subscribe((token: JwtToken) => {
      expect(token.token).toEqual(mockToken.token);
      expect(token.user).toEqual(mockToken.user);
    });

    const req = httpMock.expectOne('http://localhost:44352/Security/login');
    expect(req.request.method).toBe('GET');
    req.flush(mockToken);
  });

  it('should check if authentication is required for a URL', () => {
    const url = 'http://localhost:44352/api/v2.0/protectedUrls';
    expect(service.authRequired(url)).toBe(true);
  });

  it('should check if the JWT token has expired', () => {
    const mockToken: JwtToken = {
      token: 'mockToken',
      user: 'mockUser',
      validUntil: new Date(Date.now() - 60 * 1000),
    };
    service['jwtTokenSubject'].next(mockToken);

    expect(service.tokenExpired()).toBe(true);
  });
});
