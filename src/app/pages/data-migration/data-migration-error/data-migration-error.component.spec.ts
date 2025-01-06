import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DataMigrationService } from 'src/app/services/postgres/data-migration.service';
import { environment } from 'src/environments/environment';
import { DataMigrationErrorComponent } from './data-migration-error.component';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('DataMigrationErrorComponent', () => {
  let component: DataMigrationErrorComponent;
  let fixture: ComponentFixture<DataMigrationErrorComponent>;
  let mockDataMigrationService: jasmine.SpyObj<DataMigrationService>;

  beforeEach(async () => {
    mockDataMigrationService = jasmine.createSpyObj('DataMigrationService', [
      'getDataMigrationFileStatusById',
    ]);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [DataMigrationErrorComponent],
      providers: [
        { provide: DataMigrationService, useValue: mockDataMigrationService },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: { subscribe: () => {} } },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userUploadHistoryTable properties', () => {
    expect(component.userUploadHistoryTable.currentPage).toBe(1);
    expect(component.userUploadHistoryTable.pageCount).toBe(0);
    expect(component.userUploadHistoryTable.pageSize).toBe(
      environment.listPageSize
    );
    expect(component.userUploadHistoryTable.usersTableHeaders).toEqual([
      'Error description',
      'Row',
    ]);
    expect(component.userUploadHistoryTable.usersColumnsToDisplay).toEqual([
      'key',
      'value',
    ]);
    expect(component.userUploadHistoryTable.errorList).toBe('');
    expect(component.userUploadHistoryTable.pageName).toBe('Contactadmin');
  });

  it('should call getDataMigrationFileStatusById method of DataMigrationService', () => {
    const mockData = { errorDetails: [] };
    mockDataMigrationService.getDataMigrationFileStatusById.and.returnValue(
      of(mockData)
    );

    const mockRouteData = { data: '123' };
    component.getUploadedFilesDetails(mockRouteData);

    expect(
      mockDataMigrationService.getDataMigrationFileStatusById
    ).toHaveBeenCalledWith(mockRouteData.data);
    expect(component.userUploadHistoryTable.data.errorList).toEqual(
      mockData.errorDetails
    );
  });
});
