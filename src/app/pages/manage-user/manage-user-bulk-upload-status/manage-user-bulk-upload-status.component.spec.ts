import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { BulkUploadStatus } from 'src/app/constants/enum';
import {
  BulkUploadErrorsGridInfo,
  BulkUploadResponse,
} from 'src/app/models/bulkUploadResponse';
import { ManageUserBulkUploadStatusComponent } from './manage-user-bulk-upload-status.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageUserBulkUploadStatusComponent', () => {
  let component: ManageUserBulkUploadStatusComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadStatusComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let bulkUploadServiceSpy: jasmine.SpyObj<BulkUploadService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    activatedRouteStub = {
      params: of({ id: 'test-id' }),
    };
    bulkUploadServiceSpy = jasmine.createSpyObj('BulkUploadService', [
      'checkBulkUploadStatus',
    ]);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ManageUserBulkUploadStatusComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BulkUploadService, useValue: bulkUploadServiceSpy },
        ScrollHelper,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUserBulkUploadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should check the status of the bulk upload on init', () => {
    expect(bulkUploadServiceSpy.checkBulkUploadStatus).toHaveBeenCalledWith(
      component.organisationId,
      'test-id'
    );
  });

  describe('setErrorGridInfo', () => {
    it('should populate errorsGridInfoList with error details', () => {
      component.errorDetails = [{ key: 'error1', value: 'description1' }];
      component.setErrorGridInfo();
      const expectedGridInfo: BulkUploadErrorsGridInfo[] = [
        { errorHeading: 'error1', errorDescription: 'description1' },
      ];
      expect(component.errorsGridInfoList).toEqual(expectedGridInfo);
    });
  });

  describe('template', () => {
    beforeEach(() => {
      component.statusCheckComplete = true;
      fixture.detectChanges();
    });

    it('should display the breadcrumb navigation', () => {
      const breadcrumb =
        fixture.nativeElement.querySelector('.govuk-breadcrumbs');
      expect(breadcrumb).toBeTruthy();
    });

    it('should display the error details when errorDetails is not empty', () => {
      component.errorDetails = [{ key: 'error1', value: 'description1' }];
      fixture.detectChanges();
      const errorTable = fixture.nativeElement.querySelector('.user-table');
      expect(errorTable).toBeTruthy();
    });
  });
});
