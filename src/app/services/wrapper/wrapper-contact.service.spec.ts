import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WrapperContactService } from './wrapper-contact.service';

describe('WrapperContactService', () => {
  let service: WrapperContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WrapperContactService],
    });
    service = TestBed.inject(WrapperContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve contact reasons', () => {
    const mockContactReasons = [
      { id: 1, reason: 'Reason 1' },
      { id: 2, reason: 'Reason 2' },
      { id: 3, reason: 'Reason 3' },
    ];

    service.getContactReasons().subscribe((contactReasons) => {
      expect(contactReasons).toEqual(mockContactReasons);
    });

    const req = httpMock.expectOne(`${service.url}/contact-reasons`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContactReasons);
  });

  it('should handle error when retrieving contact reasons', () => {
    const errorMessage = 'Error retrieving contact reasons';

    service.getContactReasons().subscribe(
      () => {},
      () => {}
    );

    const req = httpMock.expectOne(`${service.url}/contact-reasons`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('error', { message: errorMessage }));
  });
});
