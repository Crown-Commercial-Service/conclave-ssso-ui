import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { delegateduser } from 'src/app/models/delegated.model';
import { UserListResponse } from 'src/app/models/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WrapperBuyerBothService {
  private org=`${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.organisation : environment.uri.api.wrapper.apiGatewayDisabled.organisation}`;
  private users=`${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.user : environment.uri.api.wrapper.apiGatewayDisabled.user}` 


  constructor(private http: HttpClient) { }


  public pendingVerification = {
    "organisationId": "474281654063910288",
    "userList": [
        {
            organisatioName : "Dreams Tech",
            organisationType : "buyer",
            dateofRegistration: "2022-10-11T00:00:00"
        },
        {
            organisatioName : "Dreams Guys",
            organisationType : "Both",
            dateofRegistration: "2022-10-11T00:00:00"
        },
        {
            organisatioName: "Brickendon",
            organisationType: "Both",
            dateofRegistration: "2022-10-11T00:00:00"
        }
    ],
    "currentPage": 1,
    "pageCount": 1,
    "rowCount": 1
  }

  public VerifiedOrg = {
    "organisationId": "474281654063910288",
    "userList": [
        {
            organisatioName : "srishit innovative",
            organisationType : "buyer",
            dateofRegistration: "2022-10-11T00:00:00"
        },
        {
            organisatioName : "sunvis softwares",
            organisationType : "Both",
            dateofRegistration: "2022-10-11T00:00:00"
        },
        {
            organisatioName: "rounds edge",
            organisationType: "Both",
            dateofRegistration: "2022-10-11T00:00:00"
        }
    ],
    "currentPage": 1,
    "pageCount": 1,
    "rowCount": 1
  }

  getpendingVerificationOrg(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
    const url = `${this.org}/${organisationId}/users?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&include-self=${includeSelf}&delegated-only=${true}&delegated-expired-only=${false}`;
    return this.http.get<UserListResponse>(url).pipe(
      map((data: UserListResponse) => {
        return  this.pendingVerification
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getVerifiedOrg(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
    const url = `${this.org}/${organisationId}/users?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&include-self=${includeSelf}&delegated-only=${true}&delegated-expired-only=${false}`;
    return this.http.get<UserListResponse>(url).pipe(
      map((data: UserListResponse) => {
        return  this.VerifiedOrg
      }), catchError(error => {
        return throwError(error);
      })
    );
  }
   
}
