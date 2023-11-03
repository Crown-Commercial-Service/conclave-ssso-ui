import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
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
    @ViewChildren('input') inputs!: QueryList<ElementRef>;
    isBulkUpload = environment.appSetting.hideBulkupload
    constructor(private router: Router, private bulkUploadService: BulkUploadService,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.bulkUploadTemplateUrl = environment.bulkUploadTemplateFileUrl;
        if(this.isBulkUpload){
            this.router.navigateByUrl('home');
            return
         }  
    }

    ngOnInit() {
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: localStorage.getItem("user_name"),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
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
            this.pushDataLayer("form_submit");
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
        } else {
            this.pushDataLayer("form_error");
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

    pushDataLayer(event:string){
        this.dataLayerService.pushEvent({
            'event': event,
            'form_id': 'Add_multiple_user Add_multiple_users_by_uploading_a_csv_file'
        });
    }
}
