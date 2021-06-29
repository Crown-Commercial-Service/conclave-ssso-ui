import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Data } from '../../models/data';
import { identityService } from '../identity/identity.service';
import { JwtToken } from '../../models/jwtToken';
import { from, Observable, of, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Scheme } from '../../models/scheme';
import { fromFetch } from 'rxjs/fetch'
import { ajax } from 'rxjs/ajax';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ciiService {

  public url: string = environment.uri.api.postgres;

  constructor(private httpClient: HttpClient, private authService: AuthService, private identityService: identityService) {

  }

  getSchemes(): Observable<any> {
    return fromFetch(`${this.url}/cii/GetSchemes`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET'
    }).pipe(
      switchMap(response => {
        if (response.ok) {
          return response.json();
        } else {
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError(err => {
        console.error(err);
        return of({ error: true, message: err.message })
      })
    );
  }

  getDetails(scheme: string, id: string): Observable<any> {
    return fromFetch(`${this.url}/cii/${scheme}?&companyNumber=${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET'
    }).pipe(
      switchMap(response => {
        if (response.ok) {
          return response.json();
        } else {
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError(err => {
        console.error(err);
        return of({ error: true, message: err.message })
      })
    );
  }

  getOrg(scheme: string, id: string): Observable<any> {
    const url = `${this.url}/cii/GetOrg?id=${id}`;
    return this.httpClient.get(url).pipe(
      switchMap((response: any) => {
        if (response) {
          return response.json();
        } else {
          return of({ error: true, message: `Error ${response.status}` });
        }
      }), catchError(error => {
        return of({ error: true, message: error.message })
      })
    );
  }

  getOrgs(id: string) {
    const url = `${this.url}/cii/GetOrgs?id=${id}`;
    return this.httpClient.get(url);
  }

  getIdentifiers(orgId: string, scheme: string, id: string) {
    const url = `${this.url}/cii/GetIdentifiers/?orgId=${orgId}&scheme=${scheme}&id=${id}`;
    return this.httpClient.get(url);
  }

  addOrganisation(json: string | null): Observable<any> {
    const body = JSON.parse(json + '');
    return ajax({
      url: `${this.url}/cii/`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
    });
  }

  updateOrganisation(json: string | null): Observable<any> {
    const body = JSON.parse(json + '');
    const url = `${this.url}/cii/`;
    return this.httpClient.put(url, body);
  }

  delete(json: string | null): Observable<any> {
    const body = JSON.parse(json + '');
    const url = `${this.url}/cii/`;
    return this.httpClient.delete(url, body);
  }

  deleteById(id: string): Observable<any> {
    const url = `${this.url}/cii/?id=` + id;
    return this.httpClient.delete(url);
  }

  deleteOrganisation(id: string): Observable<any> {
    const url = `${this.url}/cii/DeleteOrg?id=` + id;
    return this.httpClient.delete(url);
  }

  deleteScheme(orgId: string, scheme: string, id: string): Observable<any> {
    const url = `${this.url}/cii/DeleteScheme?orgId=${orgId}&scheme=${scheme}&id=${id}`
    return this.httpClient.delete(url);
  }

}
