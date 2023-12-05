import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { identityService } from './identity.service';
import { JwtToken } from '../../models/jwtToken';

describe('identityService', () => {
  let service: identityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [identityService],
    });
    service = TestBed.inject(identityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable<JwtToken>', () => {
    const dummyToken: JwtToken = {
      token: 'dummyToken',
    };

    service.getToken().subscribe((token) => {
      expect(token).toEqual(dummyToken);
    });

    const req = httpMock.expectOne(service.identityUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyToken);
  });
});
