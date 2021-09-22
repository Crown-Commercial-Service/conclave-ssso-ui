import { Injectable } from '@angular/core';
import {
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

    constructor(private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return Observable.create((observer: { next: (arg0: HttpResponse<any>) => void; error: (arg0: any) => void; complete: () => void; }) => {
            const subscription = next.handle(req)
                .subscribe(
                    event => {
                        if (event instanceof HttpResponse) {
                            observer.next(event);
                        }
                    },
                    err => {
                        observer.error(err);
                        console.log(err);
                        if (err.status == 400 && err.error == "ERROR_INVALID_INPUT_CHARACTER") {
                            console.log("ERROR_INVALID_INPUT_CHARACTER");
                            this.router.navigateByUrl("error?error_description=ERROR_INVALID_INPUT_CHARACTER");
                        }
                    },
                    () => { observer.complete(); });
            // teardown logic in case of cancelled requests
            return () => {
                subscription.unsubscribe();
            };
        });
    }
}
