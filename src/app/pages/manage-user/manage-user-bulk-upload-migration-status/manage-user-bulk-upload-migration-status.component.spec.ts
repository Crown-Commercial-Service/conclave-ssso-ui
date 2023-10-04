import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { BulkUploadStatus } from 'src/app/constants/enum';
import {
  BulkUploadResponse,
  BulkUploadSummaryGridInfo,
  BulkUploadFileContentRowDetails,
} from 'src/app/models/bulkUploadResponse';
import {
  TranslateModule,
  TranslateStore,
  TranslateService,
  TranslateLoader,
  TranslateCompiler,
  TranslateParser,
  MissingTranslationHandler,
  USE_DEFAULT_LANG,
  USE_STORE,
  USE_EXTEND,
  DEFAULT_LANGUAGE,
} from '@ngx-translate/core';
import { ManageUserBulkUploadMigrationStatusComponent } from './manage-user-bulk-upload-migration-status.component';

describe('ManageUserBulkUploadMigrationStatusComponent', () => {
  let component: ManageUserBulkUploadMigrationStatusComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadMigrationStatusComponent>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockBulkUploadService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj(['navigateByUrl']);
    mockActivatedRoute = {
      params: of({ id: '123' }),
    };
    mockBulkUploadService = jasmine.createSpyObj(['checkBulkUploadStatus']);

    await TestBed.configureTestingModule({
      imports: [TranslateModule],
      declarations: [ManageUserBulkUploadMigrationStatusComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BulkUploadService, useValue: mockBulkUploadService },
        TranslateService,
        TranslateStore,
        TranslateLoader,
        TranslateCompiler,
        TranslateParser,
        MissingTranslationHandler,
        { provide: USE_DEFAULT_LANG, useValue: true },
        { provide: USE_STORE, useValue: true },
        { provide: USE_EXTEND, useValue: true },
        { provide: DEFAULT_LANGUAGE, useValue: true },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageUserBulkUploadMigrationStatusComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getStatus method with the correct document ID', () => {
      spyOn(component, 'getStatus');
      component.ngOnInit();
      expect(component.getStatus).toHaveBeenCalledWith('123');
    });
  });

  describe('getStatus', () => {
    it('should set statusCheckComplete to true if migrationCompleted', () => {
      const mockResponse: any = {
        bulkUploadStatus: BulkUploadStatus.migrationCompleted,
        bulkUploadMigrationReportDetails: {
          migrationStartedTime: new Date(),
          migrationEndTime: new Date(),
          totalOrganisationCount: 10,
          totalUserCount: 100,
          failedUserCount: 0,
          processedUserCount: 100,
          bulkUploadFileContentRowList: [],
        },
      };
      mockBulkUploadService.checkBulkUploadStatus.and.returnValue(
        of(mockResponse)
      );
      component.getStatus('123');
      expect(component.statusCheckComplete).toBe(true);
    });

    it('should not set statusCheckComplete if not migrationCompleted', () => {
      const mockResponse: any = {
        bulkUploadStatus: BulkUploadStatus.processing,
        bulkUploadMigrationReportDetails: {
          migrationStartedTime: new Date(),
          migrationEndTime: new Date(),
          totalOrganisationCount: 10,
          totalUserCount: 100,
          failedUserCount: 0,
          processedUserCount: 100,
          bulkUploadFileContentRowList: [],
        },
      };
      mockBulkUploadService.checkBulkUploadStatus.and.returnValue(
        of(mockResponse)
      );
      component.getStatus('123');
      expect(component.statusCheckComplete).toBe(false);
    });

    it('should call setSummaryGridInfo and setDatailGridInfo if migrationCompleted', () => {
      const mockResponse: any = {
        bulkUploadStatus: BulkUploadStatus.migrationCompleted,
        bulkUploadMigrationReportDetails: {
          migrationStartedTime: new Date(),
          migrationEndTime: new Date(),
          totalOrganisationCount: 10,
          totalUserCount: 100,
          failedUserCount: 0,
          processedUserCount: 100,
          bulkUploadFileContentRowList: [],
        },
      };
      spyOn(component, 'setSummaryGridInfo');
      spyOn(component, 'setDatailGridInfo');
      mockBulkUploadService.checkBulkUploadStatus.and.returnValue(
        of(mockResponse)
      );
      component.getStatus('123');
      expect(component.setSummaryGridInfo).toHaveBeenCalledWith(mockResponse);
      expect(component.setDatailGridInfo).toHaveBeenCalledWith(mockResponse);
    });

    it('should not call setSummaryGridInfo and setDatailGridInfo if not migrationCompleted', () => {
      const mockResponse: any = {
        bulkUploadStatus: BulkUploadStatus.processing,
        bulkUploadMigrationReportDetails: {
          migrationStartedTime: new Date(),
          migrationEndTime: new Date(),
          totalOrganisationCount: 10,
          totalUserCount: 100,
          failedUserCount: 0,
          processedUserCount: 100,
          bulkUploadFileContentRowList: [],
        },
      };
      spyOn(component, 'setSummaryGridInfo');
      spyOn(component, 'setDatailGridInfo');
      mockBulkUploadService.checkBulkUploadStatus.and.returnValue(
        of(mockResponse)
      );
      component.getStatus('123');
      expect(component.setSummaryGridInfo).not.toHaveBeenCalled();
      expect(component.setDatailGridInfo).not.toHaveBeenCalled();
    });
  });

  describe('setSummaryGridInfo', () => {
    it('should add the summary grid info to the summaryGridInfoList', () => {
      const mockResponse: any = {
        bulkUploadStatus: BulkUploadStatus.migrationCompleted,
        bulkUploadMigrationReportDetails: {
          migrationStartedTime: new Date(),
          migrationEndTime: new Date(),
          totalOrganisationCount: 10,
          totalUserCount: 100,
          failedUserCount: 0,
          processedUserCount: 100,
          bulkUploadFileContentRowList: [],
        },
      };
      component.setSummaryGridInfo(mockResponse);
      expect(component.summaryGridInfoList.length).toBe(1);
      expect(component.summaryGridInfoList[0].totalOrganisations).toBe(10);
      expect(component.summaryGridInfoList[0].totalUsers).toBe(100);
    });
  });

  describe('setDatailGridInfo', () => {
    it('should set the detailGridInfoList to the bulkUploadFileContentRowList', () => {
      const mockResponse: any = {
        bulkUploadStatus: BulkUploadStatus.migrationCompleted,
        bulkUploadMigrationReportDetails: {
          migrationStartedTime: new Date(),
          migrationEndTime: new Date(),
          totalOrganisationCount: 10,
          totalUserCount: 100,
          failedUserCount: 0,
          processedUserCount: 100,
          bulkUploadFileContentRowList: [
            {
              identifierId: '1',
              schemeId: 'A',
              rightToBuy: true,
              email: 'test@test.com',
              title: 'Mr',
              firstName: 'John',
              lastName: 'Doe',
              roles: 'Admin',
              status: 'Active',
              statusDescription: 'Success',
            },
          ],
        },
      };
      component.setDatailGridInfo(mockResponse);
      expect(component.detailGridInfoList.length).toBe(1);
      expect(component.detailGridInfoList[0].identifierId).toBe('1');
      expect(component.detailGridInfoList[0].schemeId).toBe('A');
    });
  });
});
