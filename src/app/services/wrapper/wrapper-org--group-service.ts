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

  public configURl: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.configuration : environment.uri.api.wrapper.apiGatewayDisabled.configuration}`;
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
    if (!environment.appSetting.hideSimplifyRole) {
      const url = `${this.url}/${organisationId}/groups/${groupId}/servicerolegroups`;
      return this.http.get<OrganisationGroupResponseInfo>(url).pipe(
        map((data: OrganisationGroupResponseInfo) => {
          data.roles = data.serviceRoleGroups
          return data;
        }), catchError(error => {
          return throwError(error);
        })
      );
    } else {
      const url = `${this.url}/${organisationId}/groups/${groupId}`;
      return this.http.get<OrganisationGroupResponseInfo>(url).pipe(
        map((data: OrganisationGroupResponseInfo) => {
          return data;
        }), catchError(error => {
          return throwError(error);
        })
      );
    }
  }

  patchUpdateOrganisationGroup(organisationId: string, groupId: number, orgGroupPatchInfo: OrganisationGroupRequestInfo): Observable<any> {
    if (!environment.appSetting.hideSimplifyRole) {
      let serviceRoleGroupInfos = {
        addedServiceRoleGroupIds: orgGroupPatchInfo.roleInfo?.addedRoleIds,
        removedServiceRoleGroupIds: orgGroupPatchInfo.roleInfo?.removedRoleIds
      }
      orgGroupPatchInfo.serviceRoleGroupInfo = serviceRoleGroupInfos
      delete orgGroupPatchInfo.roleInfo
      const url = `${this.url}/${organisationId}/groups/${groupId}/servicerolegroups`;
      return this.http.patch(url, orgGroupPatchInfo).pipe(
        map(() => {
          return true;
        }), catchError(error => {
          return throwError(error);
        })
      );
    } else {
      const url = `${this.url}/${organisationId}/groups/${groupId}`;
      return this.http.patch(url, orgGroupPatchInfo).pipe(
        map(() => {
          return true;
        }), catchError(error => {
          return throwError(error);
        })
      );
    }
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
    if (environment.appSetting.hideSimplifyRole) {
      const url = `${this.url}/${organisationId}/roles`;
      return this.http.get<Role[]>(url).pipe(
        map((data: Role[]) => {
          data.forEach((f) => {
            switch (f.roleKey) {
              case 'CAT_USER': {
                f.serviceName = null;
                break;
              }
              case 'ACCESS_CAAAC_CLIENT': {
                f.serviceName = null;
                break;
              }
              case 'JAEGGER_SUPPLIER': {
                f.serviceName = null;
                break;
              }
              case 'JAEGGER_BUYER': {
                f.serviceName = null;
                break;
              }
              case 'JAGGAER_USER': {
                f.serviceName = null;
                break;
              }
              case 'ACCESS_JAGGAER': {
                f.serviceName = null;
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
    } else {
      const structureData: any = []
      const url = `${this.url}/${organisationId}/servicerolegroups`;
      return this.http.get<Role[]>(url).pipe(
        map((data: Role[]) => {
          data.forEach((f: any) => {
            let structureObj = {
              roleId: f.id,
              roleKey: f.key,
              roleName: f.name,
              orgTypeEligibility: f.orgTypeEligibility,
              subscriptionTypeEligibility: f.subscriptionTypeEligibility,
              tradeEligibility: f.tradeEligibility,
              description: f.description
            }
            structureData.push(structureObj)
          })
          return structureData
        }), catchError(error => {
          return throwError(error);
        })
      );
    }
  }

  getOrganisationApprovalRequiredRoles(): Observable<any> {
    const url = `${this.configURl}/approve/roles`;
    return this.http.get<Role[]>(url).pipe(map((data: Role[]) => { return data }),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  getGroupOrganisationRoles(organisationId: string): Observable<any> {
    if (!environment.appSetting.hideSimplifyRole) {
      const structureData: any = []
      const url = `${this.url}/${organisationId}/servicerolegroups`;
      return this.http.get<Role[]>(url).pipe(
        map((data: any[]) => {
          data.forEach((f) => {
            let structureObj = {
              roleId: f.id,
              roleKey: f.key,
              roleName: f.name,
              orgTypeEligibility: f.orgTypeEligibility,
              subscriptionTypeEligibility: f.subscriptionTypeEligibility,
              tradeEligibility: f.tradeEligibility,
              description: f.description,
              autoValidationRoleTypeEligibility: f.autoValidationRoleTypeEligibility
            }
            structureData.push(structureObj)
          })
          return structureData;
          return data;
        }), catchError(error => {
          return throwError(error);
        })
      );
    } else {
      const url = `${this.url}/${organisationId}/roles`;
      return this.http.get<Role[]>(url).pipe(
        map((data: Role[]) => {
          console.log("data", data)
          return data;
        }), catchError(error => {
          return throwError(error);
        })
      );
    }
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

  getUsersAdmin(organisationId: string, currentPage: number, pageSize: number, includeUnverifiedAdmin: boolean = false): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
    let url = `${this.url}/${organisationId}/users?currentPage=${currentPage}&pageSize=${pageSize}&isAdmin=true&include-self=true`;
    if (includeUnverifiedAdmin) {
      url += "&include-unverified-admin=true";
    }
    return this.http.get<UserListResponse>(url).pipe(
      map((data: UserListResponse) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }


}