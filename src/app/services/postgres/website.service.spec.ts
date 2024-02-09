import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WebsiteService } from './website.service';
import { Website } from 'src/app/models/website';
import { environment } from '../../../environments/environment';

describe('WebsiteService', () => {
  let service: WebsiteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WebsiteService],
    });
    service = TestBed.inject(WebsiteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve websites from the API via GET', () => {
    const organisationId = 1;
    const mockWebsites: Website[] = [
      {
        id: 1,
        name: 'website 1',
        dateCreated: new Date(),
      },
      {
        id: 2,
        name: 'website 2',
        dateCreated: new Date(),
      },
    ];

    service.get(organisationId).subscribe((websites: Website[]) => {
      expect(websites.length).toBe(2);
      expect(websites).toEqual(mockWebsites);
    });

    const req = httpMock.expectOne(
      `${environment.uri.api.postgres}/website?organisationId=${organisationId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWebsites);
  });

  it('should retrieve a website from the API via GET by ID', () => {
    const id = 1;
    const mockWebsite: Website = {
      id: 1,
      name: 'website 1',
      dateCreated: new Date(),
    };

    service.getById(id).subscribe((website: Website) => {
      expect(website).toEqual(mockWebsite);
    });

    const req = httpMock.expectOne(
      `${environment.uri.api.postgres}/website/${id}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWebsite);
  });

  it('should add a new website via POST', () => {
    const mockWebsite: Website = {
      id: 1,
      name: 'website 1',
      dateCreated: new Date(),
    };

    service.post(mockWebsite).subscribe((website: Website) => {
      expect(website).toEqual(mockWebsite);
    });

    const req = httpMock.expectOne(`${environment.uri.api.postgres}/website`);
    expect(req.request.method).toBe('POST');
    req.flush(mockWebsite);
  });

  it('should update an existing website via PUT', () => {
    const id = 1;
    const mockWebsite: Website = {
      id: 1,
      name: 'website 1',
      dateCreated: new Date(),
    };

    service.put(id, mockWebsite).subscribe((result: number) => {
      expect(result).toBe(1);
    });

    const req = httpMock.expectOne(
      `${environment.uri.api.postgres}/website/${id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(1);
  });

  it('should delete an existing website via DELETE', () => {
    const id = 1;

    service.delete(id).subscribe();

    const req = httpMock.expectOne(
      `${environment.uri.api.postgres}/website/${id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
