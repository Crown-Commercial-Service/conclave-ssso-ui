import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OrganisationAuditEventListResponse, OrganisationAuditListResponse } from 'src/app/models/organisation';
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

  getOrgEventLogs(organisationId: string, currentPage: number, pageSize: number): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
    if(false){
      const url = `${this.org}/${organisationId}/servicerolegroups/auditevents?currentPage=${currentPage}&pageSize=${pageSize}`;
      return this.http.get<OrganisationAuditEventListResponse>(url).pipe(
        map((data: OrganisationAuditEventListResponse) => {
          console.log("data.organisationAuditEventList",data)
          data.organisationAuditEventList = data.orgAuditEventServiceRoleGroupList
          return  data
        }), catchError(error => {
          return throwError(error);
        })
      );
    } else {
      const url = `${this.org}/${organisationId}/auditevents?currentPage=${currentPage}&pageSize=${pageSize}`;
      return this.http.get<OrganisationAuditEventListResponse>(url).pipe(
        map((data: OrganisationAuditEventListResponse) => {
          console.log("data",data)
          return  data
        }), catchError(error => {
          return throwError(error);
        })
      );
    }
  }

  manualValidation(ciiOrgId: string, status:number): Observable<any> {
    return this.http.put<any>(`${this.org}/${ciiOrgId}/manualvalidate?status=${status}`, '').pipe(
      map((data: any) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }
}
