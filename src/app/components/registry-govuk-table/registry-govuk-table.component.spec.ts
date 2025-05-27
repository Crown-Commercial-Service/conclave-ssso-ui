import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistryGovukTableComponent } from './registry-govuk-table.component';

describe('RegistryGovukTableComponent', () => {
  let component: RegistryGovukTableComponent;
  let fixture: ComponentFixture<RegistryGovukTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistryGovukTableComponent],
    });
    fixture = TestBed.createComponent(RegistryGovukTableComponent);
    component = fixture.componentInstance;
    component.headerText = ['Column1', 'Column2']; // Sample header text
    component.data = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]; // Sample data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial values correctly', () => {
    expect(component.pageCount).toBe(1);
    expect(component.totalPagesArray).toEqual([1]);
    expect(component.tableVisibleData).toEqual(component.data.slice(0, component.pageSize));
    expect(component.currentPage).toBe(1);
  });

  it('should emit hyperLinkClickEvent on row click', () => {
    const testData = { id: 1, name: 'Item 1' };
    spyOn(component.hyperLinkClickEvent, 'emit');
    component.onRowClick(testData);
    expect(component.hyperLinkClickEvent.emit).toHaveBeenCalledWith(testData);
  });

  it('should update tableVisibleData on page click', () => {
    spyOn(component.hyperLinkClickEvent, 'emit');
    component.onSetPageClick(2);
    expect(component.currentPage).toBe(2);
    expect(component.tableVisibleData).toEqual(component.data.slice(component.pageSize, 2 * component.pageSize));
  });
});
