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
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: localStorage.getItem("user_name"),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
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
                            f.link = ['Download report','View summary']
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

    public onContinueClick() {
        this.submitted = true;
        this.resetError();
        if (this.validateFile()) {
            this.pushDataLayer("form_submit");
            this.DataMigrationService.uploadDataMigrationFile(this.file).subscribe({
                next: (response: dataMigrationReportDetailsResponce) => {
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
            this.pushDataLayer("form_error");
        }
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

    public resetError() {
        this.errorInvalidFileFormat = false;
        this.errorServer = false;
        this.errorRequired = false;
        this.fileSizeExceedError = false;
    }

    public onCancelClick() {
        this.router.navigateByUrl('home');
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
