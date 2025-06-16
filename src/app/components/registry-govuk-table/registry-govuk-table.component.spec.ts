import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistryGovukTableComponent } from './registry-govuk-table.component';
import { TokenService } from 'src/app/services/auth/token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ciiService } from 'src/app/services/cii/cii.service';
import { of } from 'rxjs';

describe('RegistryGovukTableComponent', () => {
  let component: RegistryGovukTableComponent;
  let fixture: ComponentFixture<RegistryGovukTableComponent>;
  let mockTokenService: jasmine.SpyObj<TokenService>;
    let ciiServiceStub: Partial<ciiService>;

  beforeEach(async () =>{
    mockTokenService = jasmine.createSpyObj('TokenService', ['getCiiOrgId']);
    ciiServiceStub = {
          getSchemes: jasmine.createSpy('getSchemes').and.returnValue(of([])),
          getOrgDetails: jasmine.createSpy('getOrgDetails').and.returnValue(
            of({
              identifier: { scheme: 'GB-CCS', id: '123' },
              additionalIdentifiers: [
                { scheme: 'ABC', id: '456' },
                { scheme: 'XYZ', id: '789' },
              ],
            })
          ),
        };
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistryGovukTableComponent],
      imports:[HttpClientTestingModule],
       providers: [
      { provide: TokenService, useValue: mockTokenService},
      { provide: ciiService, useValue: ciiServiceStub },
    ]
    });
    fixture = TestBed.createComponent(RegistryGovukTableComponent);
    component = fixture.componentInstance;
    component.headerText = ['Column1', 'Column2']; // Sample header text
    component.data = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]; // Sample data
    component.pageCount = 1;
    component.pageSize = 10;
    component.totalPagesArray = [1];
    component.tableVisibleData = [1];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial values correctly', () => {
    expect(component.pageCount).toBe(1);
    expect(component.totalPagesArray).toEqual([1]);
    // expect(component.tableVisibleData).toEqual(component.data.slice(0, component.pageSize));
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
