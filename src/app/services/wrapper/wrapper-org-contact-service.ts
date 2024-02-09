import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ContactAssignmentInfo, ContactPoint, OrganisationContactInfo, OrganisationContactInfoList } from 'src/app/models/contactInfo';

@Injectable({
  providedIn: 'root'
})
export class WrapperOrganisationContactService {
  url: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.contact : environment.uri.api.wrapper.apiGatewayDisabled.contact}/organisations`;

  private options = {
    headers: new HttpHeaders(),

  }

  constructor(private http: HttpClient) {
  }

  assignOrgContact(organisationId: string, contactInfo: ContactAssignmentInfo): Observable<any> {
    const url = `${this.url}/${organisationId}/contacts/assignment`;
    return this.http.post<number[]>(url, contactInfo, this.options).pipe(
      map((data: number[]) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  createOrganisationContact(organisationId: string, contactInfo: ContactPoint): Observable<any> {
    const url = `${this.url}/${organisationId}/contacts`;
    return this.http.post<number>(url, contactInfo, this.options).pipe(
      map((data: number) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  deleteOrganisationContact(organisationId: string, contactId: number): Observable<any> {
    const url = `${this.url}/${organisationId}/contacts/${contactId}`;
    return this.http.delete(url, this.options).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getOrganisationContacts(organisationId: string): Observable<any> {
    const url = `${this.url}/${organisationId}/contacts`
    return this.http.get<OrganisationContactInfoList>(url, this.options).pipe(
      map((data: OrganisationContactInfoList) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getOrganisationContactById(organisationId: string, contactId: number): Observable<any> {
    const url = `${this.url}/${organisationId}/contacts/${contactId}`;
    return this.http.get<OrganisationContactInfo>(url, this.options).pipe(
      map((data: OrganisationContactInfo) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  unassignOrgContact(organisationId: string, contactPointIds: number[]): Observable<any> {
    var url = `${this.url}/${organisationId}/contacts/assignment?contact-point-ids=${contactPointIds[0]}`;
    contactPointIds.splice(0, 1).forEach((id) => {
      url = url + `&contactPointIds=${id}`;
    });
    return this.http.delete(url).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  updateOrganisationContact(organisationId: string, contactId: number, contactInfo: ContactPoint): Observable<any> {
    const url = `${this.url}/${organisationId}/contacts/${contactId}`;
    return this.http.put(url, contactInfo, this.options).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

}