import { TestBed } from '@angular/core/testing';
import { HelperService } from './helper.service';

describe('HelperService', () => {
  let service: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperService);
  });

  it('should convert UTC date to local date in Europe/London timezone', () => {
    const utcDate = new Date('2022-01-01T12:00:00Z');
    const expectedLocalDate = new Date('2022-01-01T12:00:00');
    spyOn(Date.prototype, 'toLocaleString').and.returnValue(
      '01/01/2022, 12:00:00'
    );

    const convertedDate = service.convertToLocalDateTime(utcDate);

    expect(convertedDate).toEqual(expectedLocalDate);
    expect(Date.prototype.toLocaleString).toHaveBeenCalledWith('en-GB', {
      timeZone: 'Europe/London',
    });
  });
});
