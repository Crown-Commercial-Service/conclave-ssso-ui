import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';
import {
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { environment } from 'src/environments/environment';
import { TranslateModule } from '@ngx-translate/core';

import { ManageUserBulkUploadComponent } from './manage-user-bulk-upload.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ManageUserBulkUploadComponent', () => {
  let component: ManageUserBulkUploadComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadComponent>;
  let router: Router;
  let bulkUploadService: BulkUploadService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageUserBulkUploadComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        BulkUploadService, ViewportScroller, ScrollHelper],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserBulkUploadComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    bulkUploadService = TestBed.inject(BulkUploadService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize variables correctly', () => {
    expect(component.organisationId).toBeDefined();
    expect(component.submitted).toBeFalse();
    expect(component.errorInvalidFileFormat).toBeFalse();
    expect(component.errorServer).toBeFalse();
    expect(component.errorRequired).toBeFalse();
    expect(component.fileSizeExceedError).toBeFalse();
    expect(component.file).toBeUndefined();
    expect(component.maxFileSize).toBe(
      environment.bulkUploadMaxFileSizeInBytes / (1024 * 1024)
    );
    expect(component.bulkUploadTemplateUrl).toBe(
      environment.bulkUploadTemplateFileUrl
    );
  });

  it('should read file correctly', () => {
    const fileEvent: any = {
      target: {
        files: [{ name: 'test.csv', size: 1024 }],
      },
    };
    component.readFile(fileEvent);
    expect(component.file.name).toBe('test.csv');
  });

  it('should reset error flags correctly', () => {
    component.errorInvalidFileFormat = true;
    component.errorServer = true;
    component.errorRequired = true;
    component.fileSizeExceedError = true;
    component.resetError();
    expect(component.errorInvalidFileFormat).toBeFalse();
    expect(component.errorServer).toBeFalse();
    expect(component.errorRequired).toBeFalse();
    expect(component.fileSizeExceedError).toBeFalse();
  });

  it('should navigate to add user selection on cancel click', () => {
    spyOn(router, 'navigateByUrl');
    component.onCancelClick('Cancel');
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-users/add-user-selection'
    );
  });
});
