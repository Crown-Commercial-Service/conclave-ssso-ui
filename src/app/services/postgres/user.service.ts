import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string = `${environment.uri.api.postgres}/users`;

  constructor(private http: HttpClient) { }

  resendUserActivationEmail(email: string, isExpired: boolean = false) {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded')
    }

    let body = `email=${email}`;

    return this.http.post(`${this.url}/activation-emails?is-expired=${isExpired}`, body, options).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}