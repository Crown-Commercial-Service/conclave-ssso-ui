import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';
import { environment } from '../../../environments/environment';
import { CiiOrgIdentifiersDto } from 'src/app/models/org';


@Injectable({
  providedIn: 'root'
})
export class ciiService {

  public url: string = environment.uri.api.postgres+"/cii";

  constructor(private httpClient: HttpClient) {

  }

  getSchemes(): Observable<any> {
    const url = `${this.url}/schemes`;
    return this.httpClient.get(url);
  }

  getIdentifierDetails(scheme: string, id: string): Observable<any> {
    const url = `${this.url}/identifiers?scheme=${scheme}&identifier=${encodeURIComponent(id)}`;
    return this.httpClient.get<CiiOrgIdentifiersDto>(url);
  }

  getOrgDetails(orgId: string) {
    const url = `${this.url}/organisation-details?ciiOrganisationId=${encodeURIComponent(orgId)}`;
    return this.httpClient.get<CiiOrgIdentifiersDto>(url);
  }

  getOrganisationIdentifierDetails(orgId: string, scheme: string, id: string) {
    const url = `${this.url}/organisation-identifiers/?ciiOrganisationId=${encodeURIComponent(orgId)}&scheme=${encodeURIComponent(scheme)}&identifier=${encodeURIComponent(id)}`;
    return this.httpClient.get<CiiOrgIdentifiersDto>(url);
  }

  addRegistry(orgId: string, scheme: string, id: string): Observable<any> {
    const url = `${this.url}/add-scheme?ciiOrganisationId=${encodeURIComponent(orgId)}&scheme=${encodeURIComponent(scheme)}&identifier=${encodeURIComponent(id)}`;
    return this.httpClient.put(url, {});
  }

  deleteRegistry(orgId: string, scheme: string, id: string): Observable<any> {
    const url = `${this.url}/delete-scheme?ciiOrganisationId=${encodeURIComponent(orgId)}&scheme=${encodeURIComponent(scheme)}&identifier=${encodeURIComponent(id)}`
    return this.httpClient.delete(url);
  }

}
