import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { LogInfo } from 'src/app/models/logInfo';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuditLoggerService {
    public url: string = `${environment.uri.api.postgres}/logs`;

    constructor(private http: HttpClient) {
    }

    createLog(logInfo: LogInfo){
        return this.http.post(this.url, logInfo).pipe();
    }

}