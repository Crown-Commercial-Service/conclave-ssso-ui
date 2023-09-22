import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { delegateduser, rolePermissionInfo } from 'src/app/models/delegated.model';
import { UserListResponse } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WrapperUserDelegatedService {
  private url: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.user : environment.uri.api.wrapper.apiGatewayDisabled.user}/delegate-user`;

  private Orgurl = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.organisation : environment.uri.api.wrapper.apiGatewayDisabled.organisation}`;

  private Usersurl = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.user : environment.uri.api.wrapper.apiGatewayDisabled.user}`

  private options = {
    headers: new HttpHeaders()
  }

  constructor(private http: HttpClient) {
  }


  getDeligatedOrg(): Observable<any> {
    const url = `${this.Usersurl}?user-id=${encodeURIComponent(localStorage.getItem('user_name') || '')}&is-delegated=${true}`;
    return this.http.get<delegateduser>(url).pipe(
      map((data: delegateduser) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }


  GetCurrentUsers(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
    let simplifyRoleUrl = '';
    if (!environment.appSetting.hideSimplifyRole) {
      simplifyRoleUrl = "/v1";
    }
    pageSize = pageSize <= 0 ? 10 : pageSize;
    const queryString = `?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&include-self=${includeSelf}&delegated-only=${true}&delegated-expired-only=${false}`;
    const url = `${this.Orgurl}/${organisationId}/users${simplifyRoleUrl}${queryString}`

    return this.http.get<UserListResponse>(url).pipe(
      map((data: UserListResponse) => {
        return this.mapGroupToRolesUserList(data);
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  private mapGroupToRolesUserList(data: UserListResponse) {
    let responsePayload: any = data;

    if (!environment.appSetting.hideSimplifyRole) {
      let userList = data.userList;

      userList.forEach((user: any) => {
        let structureData: rolePermissionInfo[] = [];
        var serviceRoleGroupInfo = user.servicePermissionInfo;

        serviceRoleGroupInfo?.forEach((f: any) => {
          let mapToRoleObject: rolePermissionInfo = {
            roleId: f.id,
            roleKey: f.key,
            roleName: f.name,
          };
          structureData.push(mapToRoleObject);
        });

        user.rolePermissionInfo = structureData;

      });
    }

    return responsePayload;
  }

  GetExpiredUsers(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
    let simplifyRoleUrl = '';
    if (!environment.appSetting.hideSimplifyRole) {
      simplifyRoleUrl = "/v1";
    }

    pageSize = pageSize <= 0 ? 10 : pageSize;
    const queryString = `?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&include-self=${includeSelf}&delegated-only=${true}&delegated-expired-only=${true}`
    const url = `${this.Orgurl}/${organisationId}/users${simplifyRoleUrl}${queryString}`;
    return this.http.get<UserListResponse>(url).pipe(
      map((data: UserListResponse) => {
        return this.mapGroupToRolesUserList(data);
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  createDelegatedUser(userRequest: delegateduser): Observable<any> {
    let delegateUrl = `${this.Usersurl}${environment.appSetting.hideSimplifyRole ? '/delegate-user' : '/v1/delegate-user'}`;
    return this.http
      .post<delegateduser>(delegateUrl, userRequest, this.options)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }


  updateDelegatedUser(userRequest: delegateduser): Observable<any> {
    let delegateUrl = `${this.Usersurl}${environment.appSetting.hideSimplifyRole ? '/delegate-user' : '/v1/delegate-user'}`;
    return this.http
      .put<delegateduser>(delegateUrl, userRequest, this.options)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getEdituserDetails(userId: string, delegatedOrgId: string): Observable<any> {
    let simplifyRoleUrl = '';
    if (!environment.appSetting.hideSimplifyRole) {
      simplifyRoleUrl = "/v1";
    }
    const url = `${this.Usersurl}${simplifyRoleUrl}?user-id=${encodeURIComponent(userId)}&is-delegated=${true}&delegated-organisation-id=${delegatedOrgId}`;
    return this.http.get<delegateduser>(url).pipe(
      map((data: delegateduser) => {
        return this.mapGroupToRoles(data);
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getuserDetail(userId: string, delegatedOrgId: string): Observable<any> {
    let simplifyRoleUrl = '';
    if (!environment.appSetting.hideSimplifyRole) {
      simplifyRoleUrl = "/v1";
    }
    const url = `${this.Usersurl}${simplifyRoleUrl}?user-id=${encodeURIComponent(userId)}&is-delegated=${true}&is-delegated-search=${true}&delegated-organisation-id=${delegatedOrgId}`;
    return this.http.get<delegateduser>(url).pipe(
      map((data: delegateduser) => {

        return this.mapGroupToRoles(data);
      }), catchError(error => {
        return throwError(error);
      })
    );
  }


  private mapGroupToRoles(data: delegateduser) {
    let responsePayload: any = data;

    if (!environment.appSetting.hideSimplifyRole) {
      let structureData: rolePermissionInfo[] = [];
      var serviceRoleGroupInfo = data.detail.serviceRoleGroupInfo;

      serviceRoleGroupInfo?.forEach((f: any) => {
        let mapToRoleObject: rolePermissionInfo = {
          roleId: f.id,
          roleKey: f.key,
          roleName: f.name,
        };
        structureData.push(mapToRoleObject);
      });
      responsePayload.detail.rolePermissionInfo = structureData;
    }

    return responsePayload;
  }

  deleteDelegatedUser(userId: string, organizationId: string): Observable<any> {
    const url = `${this.Usersurl}/delegate-user?user-id=${encodeURIComponent(userId)}&delegated-organisation-id=${organizationId}`;
    return this.http.delete(url, this.options).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }


  resentActivationLink(userId: string, organizationId: string) {
    const url = `${this.Usersurl}/delegate-user/resend-activation?user-id=${encodeURIComponent(userId)}&delegated-organisation-id=${organizationId}`;
    return this.http.put(url, this.options).pipe(
      map(() => {
        return true;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  activateUser(activationCode: string): Observable<any> {
    const url = `${this.Usersurl}/delegate-user/validation?acceptance-code=${activationCode}`;
    return this.http.get<any>(url, this.options).pipe(
      map((data: any) => {
        return data;
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getDelegatedEventLogs(  pageSize: number,currentPage: number, id:number,delegatedOrganisationId:string): Observable<any> {
    pageSize = pageSize <= 0 ? 10 : pageSize;
      const url = `${this.Usersurl}/v1/delegate-user/audit-events?user-id=${id}&delegated-organisation-id=${delegatedOrganisationId}&PageSize=${pageSize}&CurrentPage=${currentPage}`;
      return this.http.get<any>(url).pipe(
        map((data: any) => {
          console.log("data.organisationAuditEventList",data)
          data.organisationAuditEventList = data.orgAuditEventServiceRoleGroupList
          return  data
        }), catchError(error => {
          return throwError(error);
        })
      );
  }



}
