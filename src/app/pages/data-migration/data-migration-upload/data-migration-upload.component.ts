import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';
import { dataMigrationReportDetailsResponce } from 'src/app/models/data-migration.model';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { DataMigrationService } from 'src/app/services/postgres/data-migration.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-data-migration-upload',
    templateUrl: './data-migration-upload.component.html',
    styleUrls: ['./data-migration-upload.component.scss']
})
export class DataMigrationUploadComponent implements OnInit {
    submitted: boolean = false;
    errorInvalidFileFormat: boolean = false;
    errorServer: boolean = false;
    errorRequired: boolean = false;
    fileSizeExceedError: boolean = false;
    file: any;
    maxFileSize: number = environment.bulkUploadMaxFileSizeInBytes / (1024 * 1024);
    public formId :string = 'Data_migration upload';
    @ViewChildren('input') inputs!: QueryList<ElementRef>;
    public userUploadHistoryTable: any = {
        currentPage: 1,
        pageCount: 1,
        pageSize: environment.listPageSize,
        usersTableHeaders: ['Date of upload', 'Name', 'File name', 'Status', '.', '.'],
        usersColumnsToDisplay: ['dateOfUpload', 'name', 'fileName', 'status'],
        userList: '',
        pageName: 'Contactadmin',
        hyperTextrray: ['Download report', 'View summary']
    }
    constructor(private router: Router, private bulkUploadService: BulkUploadService,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private DataMigrationService: DataMigrationService, private dataLayerService: DataLayerService) {
        this.userUploadHistoryTable.userList = {
            currentPage: this.userUploadHistoryTable.currentPage,
            pageCount: 0,
            rowCount: 0,
            dataMigrationList: [],
        };
    }
    ngOnInit(): void {
        this.getUploadedFilesDetails()
        this.dataLayerService.pushPageViewEvent();
        this.dataLayerService.pushFormStartOnInitEvent(this.formId);
    }

    public getUploadedFilesDetails() {
        this.DataMigrationService.getDataMigrationFileDetails(this.userUploadHistoryTable.pageSize,
            this.userUploadHistoryTable.currentPage).subscribe((data) => {
                data.dataMigrationList.forEach((f: any) => {
                    switch (f.status) {
                        case 0: {
                            f.status = 'Uploading'
                            break;
                        }
                        case 1: {
                            f.status = 'Validating'
                            break;
                        }
                        case 2: {
                            f.status = 'Failed'
                            
                            f.link = ['View error summary']
                            break;
                        }
                        case 3: {
                            f.status = 'Processing'
                            break;
                        }
                        case 4: {
                            f.status = 'Completed'
                            //f.link = ['Download report','View summary']
                            break;
                        }
                        default: {
                            f.status = ''
                            break;
                        }
                    }
                })
                this.userUploadHistoryTable.userList.dataMigrationList = data.dataMigrationList
                this.userUploadHistoryTable.userList.pageCount= data.pageCount                    
            })
    }

    public setPage(pageNumber: any) {
        this.userUploadHistoryTable.currentPage = pageNumber;
        this.getUploadedFilesDetails()
    }

    public setFocus(inputIndex: number) {
        this.inputs.toArray()[inputIndex].nativeElement.focus();
    }

    public readFile(fileEvent?: any) {
        let file = fileEvent.target?.files?.[0];
        if (file) {
            this.file = file as File;
        }
    }

    public onContinueClick(buttonText:string) {
        this.submitted = true;
        this.resetError();
        let uploadStartTime = performance.now();
        if (this.validateFile()) {
            this.dataLayerService.pushFormSubmitEvent(this.formId);
            this.DataMigrationService.uploadDataMigrationFile(this.file).subscribe({
                next: (response: dataMigrationReportDetailsResponce) => {
                    let uploadEndTime = performance.now();
                    let timeElapsedInSeconds = (uploadEndTime - uploadStartTime) / 1000;

                    this.sendAnalyticsData(timeElapsedInSeconds,this.file);
                    this.router.navigateByUrl(
                        'data-migration/status?data=' + response.id
                      );
                },
                error: (err) => {
                    if (err.error == 'INVALID_DATA_MIGRATION_FILE_TYPE') {
                        this.errorInvalidFileFormat = true;
                    }
                }
            });
        } else {
            this.dataLayerService.pushFormErrorEvent(this.formId);
        }
       this.pushDataLayerEvent(buttonText);
    }

    sendAnalyticsData(timeElapsedInSeconds: number,file:any) {
        this.dataLayerService.pushEvent({ 
            event: "document_upload" ,
            interaction_type: "Data migration",
            time_elapsed: timeElapsedInSeconds.toFixed(3) + "seconds",
            file_extension: file.name.split('.').pop(),  
            file_size: file.size,  
            file_name: file.name
          });
    }

    public validateFile() {
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

    pushDataLayerEvent(buttonText:string) {
        this.dataLayerService.pushClickEvent(buttonText);
      }
      

    public resetError() {
        this.errorInvalidFileFormat = false;
        this.errorServer = false;
        this.errorRequired = false;
        this.fileSizeExceedError = false;
    }

    public onCancelClick(buttonText:string) {
        this.router.navigateByUrl('home');
        this.pushDataLayerEvent(buttonText);
    }

    public onLinkClick(data: any): void {
        if (data.event.target.innerText === "View summary") {
          this.router.navigateByUrl('data-migration/summary');
        } else {
          if(data.status === "Failed"){
            this.router.navigateByUrl(
                'data-migration/error?data=' + data.id
              );
          }
        }
      }

    pushDataLayer(event:string){
        this.dataLayerService.pushEvent({
            'event': event,
            'form_id': 'Data_migration upload'
        });
    }
}

