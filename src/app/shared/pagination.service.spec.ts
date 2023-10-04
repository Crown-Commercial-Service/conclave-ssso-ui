import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let paginationService: PaginationService;

  beforeEach(() => {
    paginationService = new PaginationService();
  });

  it('should generate the correct visible dots array', () => {
    const currentPage = 1;
    const pageCount = 3;
    const expectedDots = [1, 2, 3];

    const visibleDots = paginationService.getVisibleDots(
      currentPage,
      pageCount
    );

    expect(visibleDots).toEqual(expectedDots);
  });

  it('should not include "..." if pageCount is less than or equal to maxVisibleDots', () => {
    const currentPage = 1;
    const pageCount = 5;
    const expectedDots = [1, 2, 3, 4, 5];

    const visibleDots = paginationService.getVisibleDots(
      currentPage,
      pageCount
    );

    expect(visibleDots).toEqual(expectedDots);
  });
});
