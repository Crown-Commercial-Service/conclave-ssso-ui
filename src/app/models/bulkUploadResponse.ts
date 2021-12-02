import { KeyValue } from "@angular/common";
import { BulkUploadStatus } from "../constants/enum";

export interface BulkUploadResponse {
    id: string;
    bulkUploadStatus: BulkUploadStatus;
    errorDetails: KeyValue<string, string>[];
}

export interface BulkUploadErrorsGridInfo{
    errorHeading: string;
    errorDescription: string;
}