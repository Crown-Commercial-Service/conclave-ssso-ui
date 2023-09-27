import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  it('create an instance', () => {
    const service = new PaginationService();
    expect(service).toBeTruthy();
  });
});
