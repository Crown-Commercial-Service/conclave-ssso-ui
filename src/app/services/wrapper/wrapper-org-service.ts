import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

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
    const url = `${this.url}/${organisationId}/user?currentPage=${currentPage}&pageSize=${pageSize}&searchString=${encodeURIComponent(searchString)}&includeSelf=${includeSelf}`;
    return this.http.get<UserListResponse>(url).pipe(
      map((data: UserListResponse) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  updateOrgRoles(ciiOrgId: string, json: string | null): Observable<any> {
    const body = JSON.parse(json + '');
    return this.http.put<any>(`${this.url}/${ciiOrgId}/updateEligibleRoles`, body).pipe(
      map((data: any) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }
}