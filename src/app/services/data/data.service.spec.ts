import { TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { dataService } from './data.service';
import { identityService } from '../identity/identity.service';
import { JwtToken } from '../../models/jwtToken';
import { Data } from '../../models/data';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('dataService', () => {
  let service: dataService;
  let httpMock: HttpTestingController;
  let identityServiceSpy: jasmine.SpyObj<identityService>;

  beforeEach(() => {
    const identityServiceSpyObj = jasmine.createSpyObj('identityService', [
      'getToken',
    ]);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
