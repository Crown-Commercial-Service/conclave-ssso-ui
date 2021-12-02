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
export class ManageUserBulkUploadComponent implements OnInit {

    organisationId: string;
    submitted: boolean = false;
    errorInvalidFileFormat: boolean = false;
    errorServer: boolean = false;
    errorRequired: boolean = false;
    file: any;
    bulkUploadTemplateUrl: string;
    @ViewChildren('input') inputs!: QueryList<ElementRef>;

    constructor(private router: Router, private bulkUploadService: BulkUploadService,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,) {
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.bulkUploadTemplateUrl = environment.bulkUploadTemplateFileUrl;
    }

    ngOnInit() {

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
        if (this.validateFile()) {
            this.submitted = false;
            this.bulkUploadService.uploadFile(this.organisationId, this.file).subscribe({
                next: (response: BulkUploadResponse) => {
                    this.router.navigateByUrl(`manage-users/bulk-users/status/${response.id}`);
                },
                error: (error) => {
                    console.log(error);
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
        else {
            return true;
        }
    }

    onCancelClick() {
        console.log("cancel");
        this.router.navigateByUrl('manage-users/add-user-selection');
    }

}
