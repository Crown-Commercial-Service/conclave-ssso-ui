import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { OrganisationUserDto } from 'src/app/models/user';
import { OrganisationRegisterDto, OrganisationSearchDto } from 'src/app/models/organisation';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  public url: string = `${environment.uri.api.postgres}/organisations`;

  constructor(private http: HttpClient) { }

  get(orgName: string, currentPage: number, pageSize: number): Observable<any> {
    const url = `${this.url}?currentPage=${currentPage}&pageSize=${pageSize}&organisation-name=` + encodeURIComponent(orgName);
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

  opts: OrganisationSearchDto[] = [];

  getByName(orgName: string): Observable<OrganisationSearchDto[]> {
    const url = `${this.url}/orgs-by-name?organisation-name=` + encodeURIComponent(orgName);
    var organisations = this.http.get<OrganisationSearchDto[]>(url).pipe(
      map((data: OrganisationSearchDto[]) => {
        return data;
      }), catchError(error => {
        console.log(error);
        return throwError(error);
      })
    )
    return organisations;
  }

  getById(id: string): Observable<any> {
    const url = `${this.url}/${id}`;
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

  getUsers(name: string, currentPage: number, pageSize: number): Observable<any> {
    const url = `${this.url}/users?currentPage=${currentPage}&pageSize=${pageSize}&name=` + encodeURIComponent(name);
    var user = this.http.get<OrganisationUserDto[]>(url).pipe(
      map((data: OrganisationUserDto[]) => {
        return data;
      }), catchError(error => {
        console.log(error);
        return throwError(error);
      })
    )
    return user;
  }


  requestOrgAdminToJoinOrg(orgId: string, firstName: string, lastName: string, email: string): Observable<any> {
    const url = `${this.url}/org-admin-join-notification`;
    return this.http.post(url, { 'firstName': firstName, 'lastName': lastName, 'email': email, 'ciiOrgId': orgId }).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  registerOrganisation(organisationRegisterDto: OrganisationRegisterDto): Observable<any> {
    const url = `${this.url}/registrations`;
    return this.http.post(url, organisationRegisterDto).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }
}