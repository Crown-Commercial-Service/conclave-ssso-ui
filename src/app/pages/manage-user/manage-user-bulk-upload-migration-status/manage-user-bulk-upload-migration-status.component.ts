import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BulkUploadStatus } from 'src/app/constants/enum';
import { BulkUploadFileContentRowDetails, BulkUploadResponse, BulkUploadSummaryGridInfo } from 'src/app/models/bulkUploadResponse';
import { BulkUploadService } from 'src/app/services/postgres/bulk-upload.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-manage-user-bulk-upload-migration-status',
    templateUrl: './manage-user-bulk-upload-migration-status.component.html',
    styleUrls: ['./manage-user-bulk-upload-migration-status.component.scss']
})
export class ManageUserBulkUploadMigrationStatusComponent implements OnInit {

    organisationId: string;
    statusCheckComplete: boolean = false;
    summaryTableHeaders = ['TOTAL_ORGANISATIONS', "TOTAL_USERS", "START_TIME", "END_TIME", "DURATION", "STATUS", "PROCESSED_USERS", "FAILED_USERS"];
    summaryColumnsToDisplay = ['totalOrganisations', 'totalUsers', 'startTime', 'endTime', 'duration', 'status', 'processedUsers', 'failedUser'];
    summaryGridInfoList: BulkUploadSummaryGridInfo[] = [];
    detailTableHeaders = ['IDENTIFIER_ID', "SCHEME_ID", "RIGHT_TO_BUY", "USER_EMAIL", "TITLE", "FIRST_NAME", "LAST_NAME", "ROLES", "STATUS", "STATUS_DESCRIPTION"];
    detailColumnsToDisplay = ['identifierId', 'schemeId', 'rightToBuy', 'email', 'title', 'firstName', 'lastName', 'roles', 'status', 'statusDescription'];
    detailGridInfoList: BulkUploadFileContentRowDetails[] = [];
    isBulkUpload = environment.appSetting.hideBulkupload
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private bulkUploadService: BulkUploadService) {
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        if(this.isBulkUpload){
            this.router.navigateByUrl('home');
            return
         }   
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            if (params.id) {
                this.getStatus(params.id);
            }
        });
    }

    getStatus(docId: string) {
        this.bulkUploadService.checkBulkUploadStatus(this.organisationId, docId).subscribe({
            next: (response: BulkUploadResponse) => {
                this.statusCheckComplete = true;
                if (response.bulkUploadStatus == BulkUploadStatus.migrationCompleted) {
                    this.setSummaryGridInfo(response);
                    this.setDatailGridInfo(response);
                }
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    setSummaryGridInfo(bulkUploadResponse: BulkUploadResponse) {
        let startDate: Date = bulkUploadResponse.bulkUploadMigrationReportDetails.migrationStartedTime;
        let endDate: Date = bulkUploadResponse.bulkUploadMigrationReportDetails.migrationEndTime;

        let bulkUploadSummaryGridInfo: BulkUploadSummaryGridInfo = {
            totalOrganisations: bulkUploadResponse.bulkUploadMigrationReportDetails.totalOrganisationCount,
            totalUsers: bulkUploadResponse.bulkUploadMigrationReportDetails.totalUserCount,
            startTime: moment(startDate).format("DD/MM/YYYY HH:mm:ss"),
            endTime: moment(endDate).format("DD/MM/YYYY HH:mm:ss"),
            duration: this.getDurationDifferenceString(startDate, endDate),
            status: bulkUploadResponse.bulkUploadMigrationReportDetails.failedUserCount == 0 ? 'Completed with no errors' : "Completed with errors",
            processedUsers: bulkUploadResponse.bulkUploadMigrationReportDetails.processedUserCount,
            failedUser: bulkUploadResponse.bulkUploadMigrationReportDetails.failedUserCount
        };
        this.summaryGridInfoList.push(bulkUploadSummaryGridInfo);
    }

    getDurationDifferenceString(startDate: Date, endDate: Date) {
        let startMoment = moment(startDate);
        let endMoment = moment(endDate);
        var differenceSeconds = moment.duration(endMoment.diff(startMoment)).asSeconds();

        var hours = Math.floor(differenceSeconds / 3600);
        differenceSeconds -= hours * 3600;
        var minutes = Math.floor(differenceSeconds / 60);
        differenceSeconds -= minutes * 60;
        var seconds = Math.floor(differenceSeconds);

        var differenceString = hours > 0 ? hours + `${hours == 1 ? ' hr ' : ' hrs '}` : '';
        differenceString += minutes > 0 ? minutes + `${minutes == 1 ? ' min ' : ' mins '}` : '';
        differenceString += seconds > 0 ? seconds + ' s' : '';

        return differenceString;
    }

    setDatailGridInfo(bulkUploadResponse: BulkUploadResponse) {
        this.detailGridInfoList = bulkUploadResponse.bulkUploadMigrationReportDetails.bulkUploadFileContentRowList;
    }

}
