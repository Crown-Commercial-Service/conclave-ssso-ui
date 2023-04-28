import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BulkUploadResponse } from 'src/app/models/bulkUploadResponse';
import { dataMigrationReportDetailsResponce } from 'src/app/models/data-migration.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataMigrationService {
  public url: string = `${environment.uri.api.datamigration}`;

  constructor(private http: HttpClient) {}

  uploadDataMigrationFile(fileToUpload: File) {
    const url = `${this.url}/datamigration/upload`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    const options = {
      headers: new HttpHeaders().append('Content-Type', 'multipart/form-data'),
    };
    return this.http
      .post<dataMigrationReportDetailsResponce>(url, formData, options)
      .pipe(
        map((data: dataMigrationReportDetailsResponce) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getDataMigrationFileDetails(PageSize:number,CurrentPage:number): Observable<any> {
    const url = `${this.url}/datamigration/files?PageSize=${PageSize}&CurrentPage=${CurrentPage}`;
    var user = this.http.get<any>(url).pipe(
      map((data: any) => { 
        return data;
      }), catchError(error => {
        console.log(error);
        return throwError(error);
      })
    )
    return user;
  }

  getDataMigrationFileStatusById(id:string): Observable<any> {
    const url = `${this.url}/datamigration/status?id=${id}`;
    var user = this.http.get<any>(url).pipe(
      map((data: any) => { 
        return data;
      }), catchError(error => {
        console.log(error);
        return throwError(error);
      })
    )
    return user;
  }
}
