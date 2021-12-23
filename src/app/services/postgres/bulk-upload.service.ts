import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';

@Injectable({
    providedIn: 'root'
})
export class BulkUploadService {
    public url: string = `${environment.uri.api.postgres}/organisations`;

    constructor(private http: HttpClient) {
    }

    uploadFile(organisationId: string, fileToUpload: File) {
        const url = `${this.url}/${organisationId}/bulk-users`;
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        const options = {
            headers: new HttpHeaders().append('Content-Type', 'multipart/form-data')
          }
        return this.http.post<BulkUploadResponse>(url, formData, options).pipe(
            map((data: BulkUploadResponse) => {
                return data;
            }), catchError(error => {
                return throwError(error);
            })
        );
    }

    checkBulkUploadStatus(organisationId: string, id: string){
        const url = `${this.url}/${organisationId}/bulk-users/status?id=${id}`;
        return this.http.get<BulkUploadResponse>(url).pipe(
            map((data: BulkUploadResponse) => {
                return data;
            }), catchError(error => {
                return throwError(error);
            })
        );
    }

}