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
        return this.httpService.post(`${environment.uri.api.postgres}/auth/reset_mfa_by_ticket`, { 'ticket': ticket }).pipe(
            map(data => {
                return data;
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    sendResetMFANotification(userName: string): Observable<any> {
        return this.httpService.post(`${environment.uri.api.postgres}/auth/send_reset_mfa_notification`, { 'UserName': userName }).pipe(
            map(data => {
                return data;
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    sendResetMFANotificationByAdmin(userName: string): Observable<any> {
        return this.httpService.post(`${environment.uri.api.postgres}/auth/send_reset_mfa_notification_by_admin`, { 'UserName': userName }).pipe(
            map(data => {
                return data;
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

}