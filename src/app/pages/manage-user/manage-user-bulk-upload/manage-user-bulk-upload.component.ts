import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-manage-user-bulk-upload',
    templateUrl: './manage-user-bulk-upload.component.html',
    styleUrls: ['./manage-user-bulk-upload.component.scss']
})
export class ManageUserBulkUploadComponent {

    organisationId: string;
    submitted: boolean = false;
    errorInvalidFileFormat: boolean = false;
    errorServer: boolean = false;
    errorRequired: boolean = false;
    fileSizeExceedError: boolean = false;
    file: any;
    maxFileSize: number = environment.bulkUploadMaxFileSizeInBytes / (1024 * 1024);
    bulkUploadTemplateUrl: string;
    isBulkUpload = environment.appSetting.hideBulkupload
    @ViewChildren('input') inputs!: QueryList<ElementRef>;

    constructor(private router: Router, private bulkUploadService: BulkUploadService,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,) {
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.bulkUploadTemplateUrl = environment.bulkUploadTemplateFileUrl;
        if(this.isBulkUpload){
            this.router.navigateByUrl('home');
            return
         }    
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
