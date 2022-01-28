import { KeyValue } from "@angular/common";
import { BulkUploadStatus } from "../constants/enum";

export interface BulkUploadResponse {
    id: string;
    bulkUploadStatus: BulkUploadStatus;
    errorDetails: KeyValue<string, string>[];
    bulkUploadMigrationReportDetails: BulkUploadMigrationReportDetails;
}

export interface BulkUploadMigrationReportDetails {
    migrationStartedTime: Date,
    migrationEndTime: Date,
    totalUserCount: number,
    totalOrganisationCount: number,
    processedUserCount: number,
    failedUserCount: number,
    bulkUploadFileContentRowList: BulkUploadFileContentRowDetails[]
}

export interface BulkUploadFileContentRowDetails {
    identifierId: string,
    schemeId: string,
    rightToBuy: string,
    email: string,
    title: string,
    firstName: string,
    lastName: string,
    roles: string,
    status: string,
    statusDescription: string,
}

export interface BulkUploadErrorsGridInfo {
    errorHeading: string;
    errorDescription: string;
}

export interface BulkUploadSummaryGridInfo {
    totalOrganisations: number,
    totalUsers: number,
    startTime: string,
    endTime: string,
    duration: string,
    status: string,
    processedUsers: number,
    failedUser: number
}