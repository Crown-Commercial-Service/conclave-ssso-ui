import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import {
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ManageUserBulkUploadComponent } from './manage-user-bulk-upload.component';

describe('ManageUserBulkUploadComponent', () => {
  let component: ManageUserBulkUploadComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageUserBulkUploadComponent],
      providers: [BulkUploadService, ViewportScroller, ScrollHelper],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties correctly', () => {
    expect(component.organisationId).toBe('');
    expect(component.submitted).toBe(false);
    expect(component.errorInvalidFileFormat).toBe(false);
    expect(component.errorServer).toBe(false);
    expect(component.errorRequired).toBe(false);
    expect(component.fileSizeExceedError).toBe(false);
    expect(component.file).toBeUndefined();
    expect(component.maxFileSize).toBeGreaterThan(0);
    expect(component.isBulkUpload).toBeDefined();
  });

  it('should set focus on input element', () => {
    const inputIndex = 0;
    const inputElement = {
      nativeElement: { focus: jest.fn() },
    };
    component.inputs = new QueryList<ElementRef<any>>();
    component.inputs.reset([inputElement]);
    component.setFocus(inputIndex);
    expect(inputElement.nativeElement.focus).toHaveBeenCalled();
  });

  it('should read file when file input changes', () => {
    const file = new File(['test'], 'test.csv');
    const fileEvent = { target: { files: [file] } };

    component.readFile(fileEvent);

    expect(component.file).toBe(file);
  });

  it('should validate file and return true when file is valid', () => {
    const file = new File(['test'], 'test.csv');
    component.file = file;

    const result = component.validateFile();

    expect(result).toBe(true);
    expect(component.errorRequired).toBe(false);
    expect(component.fileSizeExceedError).toBe(false);
  });

  it('should validate file and return false when file is required', () => {
    const result = component.validateFile();

    expect(result).toBe(false);
    expect(component.errorRequired).toBe(true);
    expect(component.fileSizeExceedError).toBe(false);
  });
});
