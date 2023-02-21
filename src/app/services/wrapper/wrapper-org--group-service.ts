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
 
  public configURl:string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.configuration : environment.uri.api.wrapper.apiGatewayDisabled.configuration}`;
  public roleJson = 
    [
      {
          "Id": 59,
          "RoleGroupNameKey": "MANAGE_SUBSCRIPTIONS",
          "RoleGroupName": "Manage Subscription",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 0,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null,
      },
      {
          "Id": 60,
          "RoleGroupNameKey": "ORG_USER_SUPPORT",
          "RoleGroupName": "Organisation Users Support ",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 0,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 49,
          "RoleGroupNameKey": "ORG_ADMINISTRATOR",
          "RoleGroupName": "Organisation Administrator",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 50,
          "RoleGroupNameKey": "ORG_DEFAULT_USER",
          "RoleGroupName": "Organisation User",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 295,
          "RoleGroupNameKey": "ACCESS_TEST_SAML_CLIENT",
          "RoleGroupName": "Access Test SAML Client",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 724,
          "RoleGroupNameKey": "CAT_USER",
          "RoleGroupName": "Contract Award Service (CAS) - add service",
          "RoleGroupNameKeyDescription": "Contract Award Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 723,
          "RoleGroupNameKey": "ACCESS_CAAAC_CLIENT",
          "RoleGroupName": "Contract Award Service (CAS) - add to dashboard",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 294,
          "RoleGroupNameKey": "DIGITS_DEPARTMENT_ADMIN",
          "RoleGroupName": "Department Admin",
          "RoleGroupNameKeyDescription": "DigiTS",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 293,
          "RoleGroupNameKey": "DIGITS_CONTRACT_OWNER",
          "RoleGroupName": "Contract Owner",
          "RoleGroupNameKeyDescription": "DigiTS",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 290,
          "RoleGroupNameKey": "SERVICE_ADMIN",
          "RoleGroupName": "Service Admin",
          "RoleGroupNameKeyDescription": "DigiTS",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 289,
          "RoleGroupNameKey": "PROVIDER_APP",
          "RoleGroupName": "API Access Role",
          "RoleGroupNameKeyDescription": "DigiTS",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 302,
          "RoleGroupNameKey": "ACCESS_DIGITS_CLIENT",
          "RoleGroupName": "Access DigiTS",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 288,
          "RoleGroupNameKey": "DMP_SUPPLIER",
          "RoleGroupName": "DMP Supplier",
          "RoleGroupNameKeyDescription": "Digital Market Place",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 286,
          "RoleGroupNameKey": "ACCESS_DMP",
          "RoleGroupName": "Access DMP",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 285,
          "RoleGroupNameKey": "EL_SNR_BUYER",
          "RoleGroupName": "Snr Buyer",
          "RoleGroupNameKeyDescription": "Buyer/Supplier Information",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 284,
          "RoleGroupNameKey": "EL_JNR_BUYER",
          "RoleGroupName": "Jnr Buyer",
          "RoleGroupNameKeyDescription": "Buyer/Supplier Information",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 725,
          "RoleGroupNameKey": "FP_USER",
          "RoleGroupName": "Fleet Portal User",
          "RoleGroupNameKeyDescription": "Fleet Portal",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 726,
          "RoleGroupNameKey": "ACCESS_FP_CLIENT",
          "RoleGroupName": "Access Fleet Portal",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 277,
          "RoleGroupNameKey": "JAGGAER_TMP",
          "RoleGroupName": "Jaggaer_Temp",
          "RoleGroupNameKeyDescription": "Jaggaer",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 361,
          "RoleGroupNameKey": "ACCESS_JAGGAER",
          "RoleGroupName": "eSourcing Service - add to dashboard",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 283,
          "RoleGroupNameKey": "RMI_USER",
          "RoleGroupName": "RMI User",
          "RoleGroupNameKeyDescription": "RMI",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 282,
          "RoleGroupNameKey": "ACCESS_RMI_CLIENT",
          "RoleGroupName": "Access RMI",
          "RoleGroupNameKeyDescription": "Dashboard Service",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 278,
          "RoleGroupNameKey": "CAT_USER_LOGIN_DIRECTOR",
          "RoleGroupName": "CAS User",
          "RoleGroupNameKeyDescription": "Login Director",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 722,
          "RoleGroupNameKey": "JAEGGER_BUYER",
          "RoleGroupName": "eSourcing Service as a buyer",
          "RoleGroupNameKeyDescription": "Login Director",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 1,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 287,
          "RoleGroupNameKey": "TEST_SSO_CLIENT_USER",
          "RoleGroupName": "Test SSO Client User",
          "RoleGroupNameKeyDescription": null,
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 274,
          "RoleGroupNameKey": "ACCESS_TEST_SSO_CLIENT",
          "RoleGroupName": "Access Test Client",
          "RoleGroupNameKeyDescription": null,
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 1,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      },
      {
          "Id": 390,
          "RoleGroupNameKey": "JAGGAER_USER",
          "RoleGroupName": "eSourcing Service - add service",
          "RoleGroupNameKeyDescription": "eSourcing",
          "orgTypeEligibility": 2,
          "subscriptionTypeEligibility": 0,
          "tradeEligibility": 2,
          "RoleGroupDescription":"Description Development under process",
          "autoValidationRoleTypeEligibility": null
      }
  ]
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
    if(environment.appSetting.hideSimplifyRole){
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
      const structureData:any = []
      const url = `${this.url}/${organisationId}/roles`;
      return this.http.get<Role[]>(url).pipe(
        map((data: Role[]) => {
          this.roleJson.forEach((f:any) => {
            let structureObj = {
              roleId: f.Id,
              roleKey:f.RoleGroupNameKey,
              roleName: f.RoleGroupName + f.RoleGroupNameKeyDescription,
              orgTypeEligibility: f.orgTypeEligibility,
              subscriptionTypeEligibility: f.subscriptionTypeEligibility,
              tradeEligibility: f.tradeEligibility,
              RoleGroupDescription : "Description Development under process"
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
    return this.http.get<Role[]>(url).pipe(map((data: Role[]) => {return data } ),
       catchError(err => {
        return throwError(err);
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

  getUsersAdmin(organisationId: string, currentPage: number, pageSize: number, includeUnverifiedAdmin: boolean = false): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
    let url = `${this.url}/${organisationId}/users?currentPage=${currentPage}&pageSize=${pageSize}&isAdmin=true&include-self=true`;
    if(includeUnverifiedAdmin){
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