import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { UserListResponse } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { OrganisationDto } from 'src/app/models/organisation';

@Injectable({
  providedIn: 'root'
})
export class WrapperOrganisationService {
  url: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.organisation : environment.uri.api.wrapper.apiGatewayDisabled.organisation}`;

  constructor(private http: HttpClient) {
  }

  getOrganisation(organisationId: string) {
    const url = `${this.url}/${organisationId}`;
    return this.http.get<OrganisationDto>(url).pipe(
      map((data: OrganisationDto) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getUsers(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
    const url = `${this.url}/${organisationId}/users?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&include-self=${includeSelf}`;
    return this.http.get<UserListResponse>(url).pipe(
      map((data: UserListResponse) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  updateOrgRoles(ciiOrgId: string, json: string | null,type:string): Observable<any> {
    const body = JSON.parse(json + '');
    return this.http.put<any>(`${this.url}/${ciiOrgId}/${type}`, body).pipe(
      map((data: any) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getAutoValidationStatus(organisationId: string) {
    const url = `${this.url}/${organisationId}/validation/auto`;
    return this.http.get<OrganisationDto>(url).pipe(
      map((data: OrganisationDto) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }
  getOrganisationMfaStatus(organisationId: string):Observable<any> {
    const mfaRequired = true;
    const url = `${this.url}/${organisationId}/details?is-mfa-required=${mfaRequired}`;
    return this.http.get<string>(url).pipe(
      map((data: any) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  updateOrganisationMfaSettings(organisationId: string,isMfaRequired:boolean): Observable<any> {
    const url = `${this.url}/${organisationId}/mfa?isMFARequired=${isMfaRequired}`;
    return this.http.put(url, null).pipe(
      map((data: any) => {
        return true;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  
}