import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContryDetails } from 'src/app/models/contryDetails';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationCore {
  public url: string = `${environment.uri.api.postgres}/configurations`;
  private options = {
    headers: new HttpHeaders()
  }

  constructor(private http: HttpClient) {
  }

  getCountryDetails(): Observable<ContryDetails[]> {
    const url = `${this.url}/country-details`;
    return this.http.get<ContryDetails[]>(url, this.options).pipe(
      map((data: ContryDetails[]) => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}

