import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JwPaginationComponent } from './pagination';

describe('JwPaginationComponent', () => {
  let component: JwPaginationComponent;
  let fixture: ComponentFixture<JwPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JwPaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JwPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pager when items array is not empty', () => {
    const items = [1, 2, 3, 4, 5];
    component.items = items;
    component.ngOnInit();
    expect(component.pager).toBeDefined();
  });

  it('should not initialize pager when items array is empty', () => {
    const items: any[] = [];
    component.items = items;
    component.ngOnInit();
    expect(component.pager).toEqual({});
  });

  it('should set the correct page when setPage method is called', () => {
    const items = [1, 2, 3, 4, 5];
    component.items = items;
    component.pageSize = 2;
    component.setPage(2);
    expect(component.pager.currentPage).toBe(2);
  });

  it('should emit the correct pageOfItems when setPage method is called', () => {
    const items = [1, 2, 3, 4, 5];
    component.items = items;
    component.pageSize = 2;
    spyOn(component.changePage, 'emit');
    component.setPage(2);
    expect(component.changePage.emit).toHaveBeenCalledWith([3, 4]);
  });

  it('should calculate the correct pager properties', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    component.items = items;
    component.pageSize = 3;
    component.maxPages = 5;
    const pager = component.paginate(items.length, 2, 3, 5);
    expect(pager.totalItems).toBe(10);
    expect(pager.currentPage).toBe(2);
    expect(pager.pageSize).toBe(3);
    expect(pager.totalPages).toBe(4);
    expect(pager.startPage).toBe(1);
    expect(pager.endPage).toBe(4);
    expect(pager.startIndex).toBe(3);
    expect(pager.endIndex).toBe(5);
    expect(pager.pages).toEqual([1, 2, 3, 4]);
  });
});
