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

  public url: string = environment.uri.api.postgres + "/cii";

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

  getOrgDetails(orgId: string, includeHiddenIdentifiers: boolean = false) {
    const url = `${this.url}/organisation-details?organisation-id=${encodeURIComponent(orgId)}&include-hidden-identifiers=${includeHiddenIdentifiers}`;
    return this.httpClient.get<CiiOrgIdentifiersDto>(url);
  }

  getOrganisationIdentifierDetails(orgId: string, scheme: string, id: string) {
    const url = `${this.url}/organisation-identifiers/?organisation-id=${encodeURIComponent(orgId)}&scheme=${encodeURIComponent(scheme)}&identifier=${encodeURIComponent(id)}`;
    return this.httpClient.get<CiiOrgIdentifiersDto>(url);
  }

  addRegistry(orgId: string, scheme: string, id: string): Observable<any> {
    const url = `${this.url}/additional-identifiers?organisation-id=${encodeURIComponent(orgId)}&scheme=${encodeURIComponent(scheme)}&identifier=${encodeURIComponent(id)}`;
    return this.httpClient.put(url, {});
  }

  deleteRegistry(orgId: string, scheme: string, id: string): Observable<any> {
    const url = `${this.url}/additional-identifiers?organisation-id=${encodeURIComponent(orgId)}&scheme=${encodeURIComponent(scheme)}&identifier=${encodeURIComponent(id)}`
    return this.httpClient.delete(url);
  }

  public getSchemaName(schema: string): string {
    switch (schema) {
      case 'GB-COH': {
        return 'Companies House';
      }
      case 'US-DUN': {
        return 'Dun & Bradstreet';
      }
      case 'GB-CHC': {
        return 'Charities Commission for England and Wales';
      }
      case 'GB-SC': {
        return 'Scottish Charities Commission';
      }
      case 'GB-NIC': {
        return 'Northern Ireland Charities Commission';
      }
      default: {
        return '';
      }
    }
  }

}
