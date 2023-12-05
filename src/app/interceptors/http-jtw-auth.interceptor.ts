import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { WorkerService } from '../services/worker.service';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class HttpJwtAuthInterceptor implements HttpInterceptor {

    constructor(private workerService: WorkerService, private authService: AuthService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return this.workerService.getAccessToken().mergeMap((token: string) => {
            if (token.length > 0) {
                request = request.clone({
                    setHeaders: {
                        Authorization: 'Bearer ' + token
                    },
                    withCredentials: true
                });
            }
            else {
                request = request.clone({
                    withCredentials: true
                });
            }

            if (!request.headers.has('Content-Type')) {
                request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
            }
            if (request.headers.get('Content-Type') === 'multipart/form-data'){// Content type should be undefined to calculate the boundary value by the browser
                request = request.clone({ headers: request.headers.delete('Content-Type') });
            }
            var cookie = this.getXsrfCookie();
            if (cookie != '' && cookie != undefined) {
                request = request.clone({ headers: request.headers.set('X-XSRF-TOKEN', cookie) });
            }

            return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error.status == 401) {
                        this.authService.logOutAndRedirect();
                    }
                    return throwError(error);
                }));
        });
    }

    getXsrfCookie() {
        var theName = "XSRF-TOKEN=";
        var theCookie = document.cookie + ";";
        var start = theCookie.indexOf(theName);
        if (start != -1) {
            var end = theCookie.indexOf(";", start);
            return unescape(theCookie.substring(start + theName.length, end));
        }
        return "";
    }
}
