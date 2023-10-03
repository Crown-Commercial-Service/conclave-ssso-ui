import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { BulkUploadStatus } from '../../../constants/enum';
import {
  BulkUploadFileContentRowDetails,
  BulkUploadResponse,
  BulkUploadSummaryGridInfo,
} from '../../../models/bulkUploadResponse';
import { AppModule } from '../../../app.module';
import { ManageUserBulkUploadMigrationStatusComponent } from './manage-user-bulk-upload-migration-status.component';

describe('ManageUserBulkUploadMigrationStatusComponent', () => {
  let component: ManageUserBulkUploadMigrationStatusComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadMigrationStatusComponent>;
  let routerSpy: jest.SpyInstance;
  let activatedRouteSpy: jest.SpyInstance;
  let bulkUploadServiceSpy: jest.SpyInstance;

  beforeEach(async () => {
    routerSpy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');
    activatedRouteSpy = jest
      .spyOn(TestBed.inject(ActivatedRoute), 'params', 'get')
      .mockReturnValue(of({ id: '123' }));
    bulkUploadServiceSpy = jest
      .spyOn(TestBed.inject(BulkUploadService), 'checkBulkUploadStatus')
      .mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: BulkUploadService, useValue: bulkUploadServiceSpy },
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

  it('should redirect to home if bulk upload is hidden', () => {
    component.isBulkUpload = true;
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith('home');
  });

  it('should set statusCheckComplete to true when getStatus is called', () => {
    bulkUploadServiceSpy.mockReturnValue(
      of({
        bulkUploadStatus: BulkUploadStatus.migrationCompleted,
        bulkUploadMigrationReportDetails: {
          migrationStartedTime: new Date(),
          migrationEndTime: new Date(),
          totalOrganisationCount: 1,
          totalUserCount: 1,
          failedUserCount: 0,
          processedUserCount: 1,
          bulkUploadFileContentRowList: [],
        },
      } as BulkUploadResponse)
    );
    component.getStatus('123');
    expect(component.statusCheckComplete).toBe(true);
  });

  it('should set summaryGridInfoList and detailGridInfoList when getStatus returns migrationCompleted', () => {
    const bulkUploadResponse: BulkUploadResponse = {
      bulkUploadStatus: BulkUploadStatus.migrationCompleted,
      bulkUploadMigrationReportDetails: {
        migrationStartedTime: new Date(),
        migrationEndTime: new Date(),
        totalOrganisationCount: 1,
        totalUserCount: 1,
        failedUserCount: 0,
        processedUserCount: 1,
        bulkUploadFileContentRowList: [
          {
            identifierId: '1',
            schemeId: '1',
            rightToBuy: true,
            email: 'test@test.com',
            title: 'Mr',
            firstName: 'John',
            lastName: 'Doe',
            roles: ['Admin'],
            status: 'Success',
            statusDescription: 'User created successfully',
          },
        ],
      },
    };
    bulkUploadServiceSpy.mockReturnValue(of(bulkUploadResponse));
    component.getStatus('123');
    expect(component.summaryGridInfoList.length).toBe(1);
    expect(component.detailGridInfoList.length).toBe(1);
  });

  it('should format duration difference string correctly', () => {
    const startDate = new Date('2022-01-01T00:00:00Z');
    const endDate = new Date('2022-01-01T01:30:00Z');
    const durationString = component.getDurationDifferenceString(
      startDate,
      endDate
    );
    expect(durationString).toBe('1 hr 30 mins');
  });

  it('should display the correct breadcrumb items', () => {
    const breadcrumbItems = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__list-item'
    );
    expect(breadcrumbItems[0].textContent.trim()).toBe(
      'ADMINISTRATOR_DASHBOARD'
    );
    expect(breadcrumbItems[1].textContent.trim()).toBe(
      'MANAGE_YOUR_USER_ACCOUNTS'
    );
    expect(breadcrumbItems[2].textContent.trim()).toBe('BULK_UPLOAD_STATUS');
  });

  it('should display the summary and detail tables when statusCheckComplete is true', () => {
    component.statusCheckComplete = true;
    fixture.detectChanges();
    const summaryTable = fixture.nativeElement.querySelector(
      '.user-table:nth-child(2)'
    );
    const detailTable = fixture.nativeElement.querySelector(
      '.user-table:nth-child(4)'
    );
    expect(summaryTable).toBeTruthy();
    expect(detailTable).toBeTruthy();
  });

  it('should display the "wait until we process report details" message when statusCheckComplete is false', () => {
    const message = fixture.nativeElement.querySelector(
      '.page-title:nth-child(2)'
    );
    expect(message).toBeTruthy();
    expect(message.textContent.trim()).toBe(
      'WAIT_UNTIL_WE_PROCESS_REPORT_DETAILS'
    );
  });

  it('should display the "go to manage users" link', () => {
    const link = fixture.nativeElement.querySelector('.navigation-text');
    expect(link).toBeTruthy();
    expect(link.textContent.trim()).toBe('GO_TO_MANAGE_USERS');
  });
});
