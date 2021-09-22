import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { OrganisationUserDto } from 'src/app/models/user';
import { OrganisationRegisterDto } from 'src/app/models/organisation';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  public url: string = `${environment.uri.api.postgres}/organisation`;

  constructor(private http: HttpClient) { }

  get(orgName: string): Observable<any> {
    const url = `${this.url}/getAll?orgName=` + encodeURIComponent(orgName);
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

  getUsers(name:string): Observable<any> {
    const url = `${this.url}/getUsers?name=` + encodeURIComponent(name);
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

  registerOrganisation(organisationRegisterDto: OrganisationRegisterDto): Observable<any> {
    const url = `${this.url}/register`;
    return this.http.post(url, organisationRegisterDto).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }
}