import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { GroupList, OrganisationGroupNameInfo, OrganisationGroupRequestInfo, OrganisationGroupResponseInfo, Role } from 'src/app/models/organisationGroup';
import { IdentityProvider, IdentityProviderSummary } from 'src/app/models/identityProvider';
import { UserListResponse } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class WrapperOrganisationGroupService {
  public url: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.organisation : environment.uri.api.wrapper.apiGatewayDisabled.organisation}`;

  constructor(private http: HttpClient) {
  }

  createOrganisationGroups(organisationId: string, orgGroupNameInfo: OrganisationGroupNameInfo): Observable<any> {
    const url = `${this.url}/${organisationId}/groups`;
    return this.http.post<number>(url, orgGroupNameInfo).pipe(
      map((data: number) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getOrganisationGroups(organisationId: string, searchString: string = ''): Observable<any> {
    const url = `${this.url}/${organisationId}/groups?search-string=${encodeURIComponent(searchString)}`;
    return this.http.get<GroupList>(url).pipe(
      map((data: GroupList) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getOrganisationGroup(organisationId: string, groupId: number): Observable<any> {
    const url = `${this.url}/${organisationId}/groups/${groupId}`;
    return this.http.get<OrganisationGroupResponseInfo>(url).pipe(
      map((data: OrganisationGroupResponseInfo) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  patchUpdateOrganisationGroup(organisationId: string, groupId: number, orgGroupPatchInfo: OrganisationGroupRequestInfo): Observable<any> {
    const url = `${this.url}/${organisationId}/groups/${groupId}`;
    return this.http.patch(url, orgGroupPatchInfo).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  deleteOrganisationGroup(organisationId: string, groupId: number): Observable<any> {
    const url = `${this.url}/${organisationId}/groups/${groupId}`;
    return this.http.delete(url).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getOrganisationRoles(organisationId: string): Observable<any> {
    const url = `${this.url}/${organisationId}/roles`;
    return this.http.get<Role[]>(url).pipe(
      map((data: Role[]) => {
        data.forEach((f) => {
          switch (f.roleKey) {
            case 'CAT_USER': {
              if (f.roleName === 'CAS User') {
                f.roleName = 'Contract Award Service (CAS)';
                f.serviceName = 'add service';
              }
              break;
            }
            case 'ACCESS_CAAAC_CLIENT': {
              if (f.roleName === 'Access Contract Award Service') {
                f.roleName = 'Contract Award Service (CAS)';
                f.serviceName = 'add to dashboard';
              }
              break;
            }
            case 'JAEGGER_SUPPLIER': {
              if (f.roleName === 'Jaggaer Supplier') {
                f.roleName = 'eSourcing Service as a supplier';
                f.serviceName = null;
              }
              break;
            }
            case 'JAEGGER_BUYER': {
              if (f.roleName === 'Jaggaer Buyer') {
                f.roleName = 'eSourcing Service as a buyer';
                f.serviceName = null;
              }
              break;
            }
            case 'JAGGAER_USER': {
              if (f.roleName === 'Jaggaer User') {
                f.roleName = 'eSourcing Service';
                f.serviceName = 'add service';
              }
              break;
            }
            case 'ACCESS_JAGGAER': {
              if (f.roleName === 'Access Jaggaer') {
                f.roleName = 'eSourcing Service';
                f.serviceName = 'add to dashboard';
              }
              break;
            }
            default: {
              //statements;
              break;
            }
          }
        })
        return data
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getGroupOrganisationRoles(organisationId: string): Observable<any> {
    const url = `${this.url}/${organisationId}/roles`;
    return this.http.get<Role[]>(url).pipe(
      map((data: Role[]) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }



  getOrganisationIdentityProviders(organisationId: string): Observable<any> {
    let tempData: IdentityProvider[] = []
    const url = `${this.url}/${organisationId}/identity-providers`;
    return this.http.get<IdentityProvider[]>(url).pipe(
      map((data: IdentityProvider[]) => {
        return data.filter((f: IdentityProvider) => f.connectionName !== 'none');

      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  enableIdentityProvider(identityProviderSummary: IdentityProviderSummary): Observable<any> {
    return this.http.put<any>(`${this.url}/${identityProviderSummary.ciiOrganisationId}/identity-providers`, identityProviderSummary).pipe(
      map((data: any) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getUsersAdmin(organisationId: string, currentPage: number, pageSize: number): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
    const url = `${this.url}/${organisationId}/adminusers?currentPage=${currentPage}&pageSize=${pageSize}`;
    return this.http.get<UserListResponse>(url).pipe(
      map((data: UserListResponse) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }
}