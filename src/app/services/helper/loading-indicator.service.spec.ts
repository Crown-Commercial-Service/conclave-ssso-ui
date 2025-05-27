import { TestBed } from '@angular/core/testing';
import { LoadingIndicatorService } from './loading-indicator.service';

describe('LoadingIndicatorService', () => {
  let service: LoadingIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingIndicatorService],
    });
    service = TestBed.inject(LoadingIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial value of isLoading as true', () => {
    expect(service.isLoading.value).toBeTrue();
  });

  it('should update isLoading value when called', () => {
    service.isLoading.next(false);
    expect(service.isLoading.value).toBeFalse();
  });
});
