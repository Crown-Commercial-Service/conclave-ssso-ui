import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ContactReason } from 'src/app/models/contactDetail';

@Injectable({
  providedIn: 'root'
})
export class WrapperContactService {

  public url: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.contact : environment.uri.api.wrapper.apiGatewayDisabled.contact}`;

  private options = {
    headers: new HttpHeaders()
  }

  constructor(private http: HttpClient) {
  }

  getContactReasons(): Observable<any> {
    const url = `${this.url}/contact-reasons`;
    return this.http.get<ContactReason[]>(url, this.options).pipe(
      map((data: ContactReason[]) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

}