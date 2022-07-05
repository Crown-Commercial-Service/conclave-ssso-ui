import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
import { LoadingIndicatorService } from '../services/helper/loading-indicator.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class LoadingIndicatorInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  urlExceptions: string[] = []

  constructor(private loadingIndicatorService: LoadingIndicatorService) {
    this.urlExceptions = [
      `${environment.uri.api.security}/security/authorize`,
      `${environment.uri.api.security}/security/token`,
      `${environment.uri.api.postgres}/auth/refresh-tokens`,
      `${environment.uri.api.postgres}/auth/sessions`,
      `${environment.uri.api.postgres}/organisations/orgs-by-name`
    ];
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loadingIndicatorService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.urlExceptions.includes(req.url) || this.urlExceptions.includes(req.url.split('?')[0])) {
      this.loadingIndicatorService.isLoading.next(false);
    }else{
      this.requests.push(req);
      this.loadingIndicatorService.isLoading.next(true);
    }
    return Observable.create((observer: { next: (arg0: HttpResponse<any>) => void; error: (arg0: any) => void; complete: () => void; }) => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => { this.removeRequest(req); observer.error(err); },
          () => { this.removeRequest(req); observer.complete(); });
      // teardown logic in case of cancelled requests
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
