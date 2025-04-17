import { TestBed } from '@angular/core/testing';
import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  let service: WorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get access token', (done) => {
    service.getAccessToken().subscribe((accessToken) => {
      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBe(0);
      done();
    });
  });

  it('should check access token', (done) => {
    service.checkAccessToken().then((isValid) => {
      expect(typeof isValid).toBe('boolean');
      done();
    });
  });
});
