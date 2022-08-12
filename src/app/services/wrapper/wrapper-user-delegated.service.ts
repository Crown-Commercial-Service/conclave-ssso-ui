import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ContactPoint } from 'src/app/models/contactInfo';
import { delegateduser } from 'src/app/models/delegated.model';
import { UserListResponse } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WrapperUserDelegatedService {
 private url: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.user : environment.uri.api.wrapper.apiGatewayDisabled.user}/delegate-user`;
private Orgurl=`${environment.uri.api.isApiGateWayEnabled ?
  environment.uri.api.wrapper.apiGatewayEnabled.user : environment.uri.api.wrapper.apiGatewayDisabled.organisation}`;
  private Usersurl=`${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.user : environment.uri.api.wrapper.apiGatewayDisabled.user}`  
private options = {
    headers: new HttpHeaders()
}

constructor(private http: HttpClient) {
}


GetCurrentUsers(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
  pageSize = pageSize <= 0 ? 10 : pageSize;
  const url = `${this.Orgurl}/${organisationId}/users?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&include-self=${includeSelf}&delegated-only=${true}&delegated-expired-only=${false}`;
  return this.http.get<UserListResponse>(url).pipe(
    map((data: UserListResponse) => {
      console.log("GetCurrentUsers")
      return data;
    }), catchError(error => {
      return throwError(error);
    })
  );
}

GetExpiredUsers(organisationId: string, searchString: string, currentPage: number, pageSize: number, includeSelf: boolean = false): Observable<any> {
  pageSize = pageSize <= 0 ? 10 : pageSize;
  const url = `${this.Orgurl}/${organisationId}/users?currentPage=${currentPage}&pageSize=${pageSize}&search-string=${encodeURIComponent(searchString)}&include-self=${includeSelf}&delegated-only=${true}&delegated-expired-only=${true}`;
  return this.http.get<UserListResponse>(url).pipe(
    map((data: UserListResponse) => {
      console.log("GetExpiredUsers")
      return data;
    }), catchError(error => {
      return throwError(error);
    })
  );
}

createDelegatedUser(userRequest: delegateduser): Observable<any> {
  const url = `${this.url}`;
  return this.http
    .post<delegateduser>(url, userRequest, this.options)
    .pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
}
// https://localhost:44309/users?user-id=8848&delegatedOrgId=58748'

getEdituserDetails(userId: string, delegatedOrgId: string): Observable<any> {
  const url = `${this.Usersurl}?user-id=${userId}&is-delegated=${true}&delegated-organisation-id=${delegatedOrgId}`;
  return this.http.get<delegateduser>(url).pipe(
    map((data: delegateduser) => {
      return data;
    }), catchError(error => {
      return throwError(error);
    })
  );
}


getuserDetail(userId: string): Observable<any> {
  const url = `${this.Usersurl}?user-id=${userId}&is-delegated=${true}`;
  return this.http.get<delegateduser>(url).pipe(
    map((data: delegateduser) => {
      return data;
    }), catchError(error => {
      return throwError(error);
    })
  );
}


deleteDelegatedUser(userId: string, organizationId: string): Observable<any> {
  const url = `${this.Usersurl}/delegate-user?user-id=${userId}&organisation-id=${organizationId}`;
  return this.http.delete(url,this.options).pipe(
    map(() => {
      return true;
    }), catchError(error => {
      return throwError(error);
    })
  );
  }

}
