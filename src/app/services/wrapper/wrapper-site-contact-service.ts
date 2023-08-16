import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ContactAssignmentInfo, ContactPoint, SiteContactInfo, SiteContactInfoList } from 'src/app/models/contactInfo';
import { ContactAssignedStatus } from 'src/app/constants/enum';

@Injectable({
  providedIn: 'root'
})
export class WrapperSiteContactService {
  url: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.organisation : environment.uri.api.wrapper.apiGatewayDisabled.organisation}`;

  private options = {
    headers: new HttpHeaders(),

  }

  constructor(private http: HttpClient) {
  }

  assignSiteContact(organisationId: string, siteId: number, contactInfo: ContactAssignmentInfo): Observable<any> {
    const url = `${this.url}/${organisationId}/sites/${siteId}/contacts/assignment`;
    return this.http.post<number[]>(url, contactInfo, this.options).pipe(
      map((data: number[]) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  createSiteContact(organisationId: string, siteId: number, contactInfo: ContactPoint): Observable<any> {
    const url = `${this.url}/${organisationId}/sites/${siteId}/contacts`;
    return this.http.post<number>(url, contactInfo, this.options).pipe(
      map((data: number) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  deleteSiteContact(organisationId: string, siteId: number, contactId: number): Observable<any> {
    const url = `${this.url}/${organisationId}/sites/${siteId}/contacts/${contactId}`;
    return this.http.delete(url, this.options).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getSiteContacts(organisationId: string, siteId: number, contactAssignedStatus: ContactAssignedStatus = ContactAssignedStatus.all): Observable<any> {
    const url = `${this.url}/${organisationId}/sites/${siteId}/contacts?contact-assigned-status=${contactAssignedStatus}`
    return this.http.get<SiteContactInfoList>(url, this.options).pipe(
      map((data: SiteContactInfoList) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getSiteContactById(organisationId: string, siteId: number, contactId: number): Observable<any> {
    const url = `${this.url}/${organisationId}/sites/${siteId}/contacts/${contactId}`;
    return this.http.get<SiteContactInfo>(url, this.options).pipe(
      map((data: SiteContactInfo) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  unassignSiteContact(organisationId: string, siteId: number, contactPointIds: number[]): Observable<any> {
    var url = `${this.url}/${organisationId}/sites/${siteId}/contacts/assignment?contact-point-ids=${contactPointIds[0]}`;
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

  updateSiteContact(organisationId: string,  siteId: number, contactId: number, contactInfo: ContactPoint): Observable<any> {
    const url = `${this.url}/${organisationId}/sites/${siteId}/contacts/${contactId}`;
    return this.http.put(url, contactInfo, this.options).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

}