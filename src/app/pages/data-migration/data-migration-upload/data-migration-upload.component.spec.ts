import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ElementRef, QueryList } from '@angular/core';
import { DataMigrationUploadComponent } from './data-migration-upload.component';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { DataMigrationService } from 'src/app/services/postgres/data-migration.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { TranslateModule } from '@ngx-translate/core';

describe('DataMigrationUploadComponent', () => {
  let component: DataMigrationUploadComponent;
  let fixture: ComponentFixture<DataMigrationUploadComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataMigrationUploadComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        BulkUploadService,
        DataMigrationService,
        ViewportScroller,
        ScrollHelper,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationUploadComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home page on cancel click', () => {
    spyOn(router, 'navigateByUrl');
    component.onCancelClick('Cancel');
    expect(router.navigateByUrl).toHaveBeenCalledWith('home');
  });

  it('should set focus to input element', () => {
    const inputIndex = 0;
    const inputElement = {
      nativeElement: { focus: jasmine.createSpy() },
    } as ElementRef;
    component.inputs = new QueryList<ElementRef>();
    component.inputs.reset([inputElement]);
    component.setFocus(inputIndex);
    expect(inputElement.nativeElement.focus).toHaveBeenCalled();
  });

  it('should read file on file input change', () => {
    const file = new File(['dummy content'], 'dummy.csv');
    const fileEvent = { target: { files: [file] } };
    component.readFile(fileEvent);
    expect(component.file).toEqual(file);
  });

  it('should validate file and return true if file is valid', () => {
    component.file = new File(['dummy content'], 'dummy.csv');
    const result = component.validateFile();
    expect(result).toBeTrue();
    expect(component.errorRequired).toBeFalse();
    expect(component.fileSizeExceedError).toBeFalse();
  });

  it('should validate file and return false if file is not selected', () => {
    component.file = null;
    const result = component.validateFile();
    expect(result).toBeFalse();
    expect(component.errorRequired).toBeTrue();
    expect(component.fileSizeExceedError).toBeFalse();
  });
});
