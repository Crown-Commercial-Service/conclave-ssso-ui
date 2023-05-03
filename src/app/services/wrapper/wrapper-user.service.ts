import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

import {
  acceptRejectRequestDetail,
  PendingApproveRole,
  User,
  UserEditResponseInfo,
  UserProfileRequestInfo,
  UserProfileResponseInfo,
  UserProfileServiceResponseInfo,
} from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WrapperUserService {
  url: string = `${
    environment.uri.api.isApiGateWayEnabled
      ? environment.uri.api.wrapper.apiGatewayEnabled.user
      : environment.uri.api.wrapper.apiGatewayDisabled.user
  }`;

  private options = {
    headers: new HttpHeaders(),
  };


  constructor(private http: HttpClient) {}

  createUser(userRequest: UserProfileRequestInfo): Observable<any> {
    if(!environment.appSetting.hideSimplifyRole){
      const url = `${this.url}/v1`;
      userRequest.detail.serviceRoleGroupIds = userRequest.detail.roleIds
      delete userRequest.detail.roleIds
      return this.http
        .post<UserEditResponseInfo>(url, userRequest, this.options)
        .pipe(
          map((data: UserEditResponseInfo) => {
            return data;
          }),
          catchError((error) => {
            return throwError(error);
          })
        );
    } else {
      const url = `${this.url}`;
      return this.http
        .post<UserEditResponseInfo>(url, userRequest, this.options)
        .pipe(
          map((data: UserEditResponseInfo) => {
            return data;
          }),
          catchError((error) => {
            return throwError(error);
          })
        );
    }
  }
 
  // Commented below code to remove usage of api. This will be handled with user update api.
  createPendingApproveRole(userRequest: PendingApproveRole): Observable<any> {
    // const url = `${this.url}/approve/roles`;
    // return this.http
    //   .post<UserEditResponseInfo>(url, userRequest, this.options)
    //   .pipe(
    //     map((data: UserEditResponseInfo) => {
    //       return data;
    //     }),
    //     catchError((error) => {
    //       return throwError(error);
    //     })
    //   );
    return Observable.of(true);
  }

  deleteUser(userName: string): Observable<any> {
    const url = `${this.url}?user-id=${encodeURIComponent(userName)}`;
    return this.http.delete(url, this.options).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getUser(userName: string): Observable<UserProfileResponseInfo> {
    if(!environment.appSetting.hideSimplifyRole){
      let roleInfo: any[]=[]
      const url = `${this.url}/v1?user-id=${encodeURIComponent(userName)}`;
      return this.http.get<UserProfileServiceResponseInfo>(url, this.options).pipe(
        map((data: any) => {
          data.detail.serviceRoleGroupInfo.forEach((roles:any)=>{
            let structureObj = {
              roleId: roles.id,
              roleKey:roles.key,
              roleName: roles.name,
            }
            roleInfo.push(structureObj)
          })
          data.detail.rolePermissionInfo = roleInfo
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
    } else {
      const url = `${this.url}?user-id=${encodeURIComponent(userName)}`;
      return this.http.get<UserProfileResponseInfo>(url, this.options).pipe(
        map((data: UserProfileResponseInfo) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
    }
  }

  getPendingApprovalUserRole(userName: string): Observable<UserProfileResponseInfo> {
    if(!environment.appSetting.hideSimplifyRole){
      let roleInfo: any=[]
      const url = `${this.url}/approve/servicerolegroups?user-id=${encodeURIComponent(userName)}`;
      return this.http.get<UserProfileResponseInfo>(url, this.options).pipe(
        map((data: any) => {
          data.forEach((role:any)=>{
            let structureObj = {
              roleId: role.id,
              roleKey:role.key,
              roleName: role.name,
              approvalStatus: role.status
            }
            roleInfo.push(structureObj)
          })
          return roleInfo;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
    } else {
      const url = `${this.url}/approve/roles?user-id=${encodeURIComponent(userName)}`;
      return this.http.get<UserProfileResponseInfo>(url, this.options).pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
    }
  }

  userTokenVerify(encryptedToken: string): Observable<UserProfileResponseInfo> {
    if(!environment.appSetting.hideSimplifyRole){
      const url = `${this.url}/approve/servicerolegroup/verify?token=${encodeURIComponent(encryptedToken)}`;
      return this.http.get<UserProfileResponseInfo>(url, this.options).pipe(
        map((data: any) => {
          return data
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
    } else {
      const url = `${this.url}/approve/verify?token=${encodeURIComponent(encryptedToken)}`;
      return this.http.get<UserProfileResponseInfo>(url, this.options).pipe(
        map((data: any) => {
          return data
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
    }
  }

  addUserTokenVerification(encryptedToken: string): Observable<UserProfileResponseInfo> {
      const url = `${this.url}/join-request-validation?details=${encodeURIComponent(encryptedToken)}`;
      return this.http.get<UserProfileResponseInfo>(url, this.options).pipe(
        map((data: any) => {
          return data
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }


  updateUser(
    userName: string,
    userRequest: UserProfileRequestInfo
  ): Observable<any> {
    if(!environment.appSetting.hideSimplifyRole){
      const url = `${this.url}/v1?user-id=${encodeURIComponent(userName)}`;
      userRequest.detail.serviceRoleGroupIds = userRequest.detail.roleIds
      delete userRequest.detail.roleIds
      return this.http
        .put<UserEditResponseInfo>(url, userRequest, this.options)
        .pipe(
          map((data: UserEditResponseInfo) => {
            return data;
          }),
          catchError((error) => {
            return throwError(error);
          })
        );
    } else {
      const url = `${this.url}?user-id=${encodeURIComponent(userName)}`;
      return this.http
        .put<UserEditResponseInfo>(url, userRequest, this.options)
        .pipe(
          map((data: UserEditResponseInfo) => {
            return data;
          }),
          catchError((error) => {
            return throwError(error);
          })
        );
    }
  }

  // Commented below code to remove usage of api. This will be handled with user update api.
  deleteApprovePendingRole(userName: string, roleIds: number): Observable<any> {
    // const url = `${this.url}/approve/roles?user-id=${encodeURIComponent(userName)}&roles=${roleIds}`;
    // return this.http.delete(url).pipe(
    //   map(() => {
    //     return true;
    //   }), catchError(error => {
    //     return throwError(error);
    //   })
    // );
    return Observable.of(true);
  }

  acceptRejectRequest(userRequest: acceptRejectRequestDetail): Observable<any> {
    const url = `${this.url}/approve/roles`;
    return this.http
      .put<UserEditResponseInfo>(url, userRequest, this.options)
      .pipe(
        map((data: UserEditResponseInfo) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  resetUserPassword(userName: string, component: string): Observable<any> {
    const url = `${this.url}/passwords?user-id=${encodeURIComponent(
      userName
    )}&component=${component}`;
    return this.http.put(url, null).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  removeAdminRoles(userName: string): Observable<any> {
    const url = `${this.url}/admin-roles?user-id=${encodeURIComponent(
      userName
    )}`;
    return this.http.delete(url).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  addAdminRole(userName: string): Observable<any> {
    const url = `${this.url}/admin-roles?user-id=${encodeURIComponent(
      userName
    )}`;
    return this.http.put(url, {}, this.options).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
