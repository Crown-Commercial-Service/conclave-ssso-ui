import { TestBed, inject } from '@angular/core/testing';

import { CommonAttributesService } from './common-attributes.service';

describe('CommonAttributesService', () => {
  let service: CommonAttributesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonAttributesService],
    });
    service = TestBed.inject(CommonAttributesService);
  });

  it('should create the service', inject(
    [CommonAttributesService],
    (service: CommonAttributesService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should remove "open" attribute from other details when a detail is clicked', () => {
    const details = document.querySelectorAll('details');
    const targetDetail = details[0];
    const otherDetails = Array.from(details).filter(
      (detail) => detail !== targetDetail
    );

    otherDetails.forEach((detail) => {
      expect(detail.hasAttribute('open')).toBe(false);
    });
  });
});
