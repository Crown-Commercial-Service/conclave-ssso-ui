import { TestBed } from '@angular/core/testing';
import { GlobalRouteService } from './global-route.service';

describe('GlobalRouteService', () => {
  let service: GlobalRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an initial value for globalRoute', () => {
    expect(service.globalRoute).toEqual('');
  });
});
