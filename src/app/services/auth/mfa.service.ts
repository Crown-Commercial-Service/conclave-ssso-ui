import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class MFAService {
    constructor(private readonly httpService: HttpClient) {
    }

    resetMFA(ticket: string): Observable<any> {
        return this.httpService.post(`${environment.uri.api.postgres}/authorization​/mfa-reset-by-tickets`, { 'ticket': ticket }).pipe(
            map(data => {
                return data;
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    sendResetMFANotification(userName: string): Observable<any> {
        return this.httpService.post(`${environment.uri.api.postgres}/authorization​/mfa-reset-notifications`, { 'UserName': userName }).pipe(
            map(data => {
                return data;
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    sendResetMFANotificationByAdmin(userName: string): Observable<any> {
        return this.httpService.post(`${environment.uri.api.postgres}/authorization​/mfa-reset-notification-by-admins`, { 'UserName': userName }).pipe(
            map(data => {
                return data;
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

}