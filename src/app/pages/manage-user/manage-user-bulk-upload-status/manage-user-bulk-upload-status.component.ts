import { KeyValue, ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BulkUploadStatus } from 'src/app/constants/enum';
import { BulkUploadErrorsGridInfo, BulkUploadResponse } from 'src/app/models/bulkUploadResponse';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-manage-user-bulk-upload-status',
    templateUrl: './manage-user-bulk-upload-status.component.html',
    styleUrls: ['./manage-user-bulk-upload-status.component.scss']
})
export class ManageUserBulkUploadStatusComponent implements OnInit {
    private id!: string;

    organisationId: string;
    errorServer: boolean = false;
    statusInterval: any;
    errorDetails: KeyValue<string, string>[] = [];
    statusCheckComplete: boolean = false;
    errorTableHeaders = ['ERROR_HEADING', "ERROR_DESCRIPTION"];
    errorColumnsToDisplay = ['errorHeading', 'errorDescription'];
    errorsGridInfoList: BulkUploadErrorsGridInfo[] = [];
    isBulkUpload = environment.appSetting.hideBulkupload
    constructor(private sessionService:SessionService,public router: Router, private activatedRoute: ActivatedRoute, private bulkUploadService: BulkUploadService, private dataLayerService: DataLayerService) {
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        if(this.isBulkUpload){
            this.router.navigateByUrl('home');
            return
         }  
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            if (params.id) {
                this.id = params.id;
                this.checkStatus(params.id);
                this.statusInterval = setInterval(() => {
                    this.checkStatus(params.id);
                }, environment.bulkUploadPollingFrequencyInSeconds * 1000);
            }
        });
        
        this.dataLayerService.pushPageViewEvent({id: this.id});
    }

    checkStatus(docId: string) {
        console.log("Check Status " + docId);
        this.bulkUploadService.checkBulkUploadStatus(this.organisationId, docId).subscribe({
            next: (response: BulkUploadResponse) => {
                if (response.bulkUploadStatus !== BulkUploadStatus.processing &&
                    response.bulkUploadStatus !== BulkUploadStatus.validating) {
                    this.clearInterval();
                    this.statusCheckComplete = true;
                    this.errorDetails = response.errorDetails;
                    this.setErrorGridInfo();
                }
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    setErrorGridInfo() {
        this.errorDetails.forEach((errDetail) => {
            this.errorsGridInfoList.push({
                errorHeading: errDetail.key,
                errorDescription: errDetail.value
            });
        });
    }

    ngOnDestroy() {
        this.clearInterval();
    }

    clearInterval() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
        }
    }

}
