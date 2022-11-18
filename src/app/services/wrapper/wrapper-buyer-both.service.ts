import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OrganisationAuditListResponse } from 'src/app/models/organisation';
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

  getpendingVerificationOrg(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
    debugger;
    pageSize = pageSize <= 0 ? 10 : pageSize;
    const url = `${this.org}/audits?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&pending-only=true`;
    return this.http.get<OrganisationAuditListResponse>(url).pipe(
      map((data: OrganisationAuditListResponse) => {
        return  data
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getVerifiedOrg(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
    const url = `${this.org}/audits?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&pending-only=false`;
    return this.http.get<OrganisationAuditListResponse>(url).pipe(
      map((data: OrganisationAuditListResponse) => {
        return  data
      }), catchError(error => {
        return throwError(error);
      })
    );
  }
   
}
