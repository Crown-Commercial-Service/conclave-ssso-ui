import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

import {
  User,
  UserEditResponseInfo,
  UserProfileRequestInfo,
  UserProfileResponseInfo,
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

  updateUser(
    userName: string,
    userRequest: UserProfileRequestInfo
  ): Observable<any> {
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
