import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { dataService } from './data.service';
import { identityService } from '../identity/identity.service';
import { JwtToken } from '../../models/jwtToken';
import { Data } from '../../models/data';
import { of } from 'rxjs';

describe('dataService', () => {
  let service: dataService;
  let httpMock: HttpTestingController;
  let identityServiceSpy: jasmine.SpyObj<identityService>;

  beforeEach(() => {
    const identityServiceSpyObj = jasmine.createSpyObj('identityService', [
      'getToken',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        dataService,
        { provide: identityService, useValue: identityServiceSpyObj },
      ],
    });

    service = TestBed.inject(dataService);
    httpMock = TestBed.inject(HttpTestingController);
    identityServiceSpy = TestBed.inject(
      identityService
    ) as jasmine.SpyObj<identityService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve data with authorization header', async(
    inject([HttpTestingController], (httpClient: HttpTestingController) => {
      const mockToken: JwtToken = { token: 'mockToken' };

      identityServiceSpy.getToken.and.returnValue(of(mockToken));

      service.getData().then((data: Data[]) => {
        expect(data).toBeTruthy();
        expect(data.length).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne('http://localhost:44352/api/data');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${mockToken.token}`
      );

      const mockData: Data[] = [
        { id: 1, organisation: 'Data 1' },
        { id: 2, organisation: 'Data 2' },
      ];
      req.flush(mockData);
    })
  ));
});
