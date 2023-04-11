import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-data-migration-upload',
  templateUrl: './data-migration-upload.component.html',
  styleUrls: ['./data-migration-upload.component.scss']
})
export class DataMigrationUploadComponent implements OnInit {

  organisationId: string;
  submitted: boolean = false;
  errorInvalidFileFormat: boolean = false;
  errorServer: boolean = false;
  errorRequired: boolean = false;
  fileSizeExceedError: boolean = false;
  file: any;
  maxFileSize: number = environment.bulkUploadMaxFileSizeInBytes / (1024 * 1024);
  bulkUploadTemplateUrl: string;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  public userUploadHistoryTable: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['Date of upload', 'Name', 'File name', 'Status'],
    usersColumnsToDisplay: ['date', 'name', 'fileName', 'status'],
    userList: '',
    pageName: 'Contactadmin',
    hyperTextrray: ['Download report', 'View summary']
  }
  constructor(private router: Router, private bulkUploadService: BulkUploadService,
      protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,) {
      this.organisationId = localStorage.getItem('cii_organisation_id') || '';
      this.bulkUploadTemplateUrl = environment.bulkUploadTemplateFileUrl;
       this.userUploadHistoryTable.userList = {
        currentPage: this.userUploadHistoryTable.currentPage,
        pageCount: 0,
        rowCount: 0,
        organisationId: this.organisationId,
        userList: [],
      };
  }
  ngOnInit(): void {
    this.userUploadHistoryTable.userList.userList = [
        {
            date: '01/01/2023',
            name:'Ajith',
            fileName:'data_migration01.csv',
            status:'Processing'  
        },
        {
            date: '01/01/2023',
            name:'Vijay',
            fileName:'data_migration01.csv',
            status:'Processing'  
        },
        {
            date: '01/01/2023',
            name:'Brijesh',
            fileName:'data_migration01.csv',
            status:'Processing'  
        },
        {
            date: '01/01/2023',
            name:'Raj',
            fileName:'data_migration01.csv',
            status:'Processing'  
        },
        {
            date: '01/01/2023',
            name:'Artur plak',
            fileName:'data_migration01.csv',
            status:'Complete'  
        },
    ]
  }

  setFocus(inputIndex: number) {
      this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  readFile(fileEvent?: any) {
      let file = fileEvent.target?.files?.[0];
      if (file) {
          this.file = file as File;
      }
  }

  onContinueClick() {
      this.submitted = true;
      this.resetError();
      if (this.validateFile()) {
          // this.submitted = false;
          this.bulkUploadService.uploadFile(this.organisationId, this.file).subscribe({
              next: (response: BulkUploadResponse) => {
                  this.router.navigateByUrl(`manage-users/bulk-users/status/${response.id}`);
              },
              error: (err) => {
                  if (err.error == 'INVALID_BULKUPLOAD_FILE_TYPE') {
                      this.errorInvalidFileFormat = true;
                  }
              }
          });
      }
  }

  validateFile() {
      this.errorRequired = false;
      if (!this.file) {
          this.errorRequired = true;
          return false;
      }
      else if (this.file.size >= environment.bulkUploadMaxFileSizeInBytes) {
          this.fileSizeExceedError = true;
          return false;
      }
      return true;
  }

  resetError() {
      this.errorInvalidFileFormat = false;
      this.errorServer = false;
      this.errorRequired = false;
      this.fileSizeExceedError = false;
  }

  onCancelClick() {
      this.router.navigateByUrl('manage-users/add-user-selection');
  }
}
