import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenInfo } from "../models/auth";
import 'rxjs/add/observable/fromPromise';

@Injectable({
    providedIn: 'root'
})
export class WorkerService {
    private worker: any;

    getAccessToken(): Observable<string> {
        return Observable.fromPromise(this._getAccessToken());
    }

  private _getAccessToken(): Promise<string> {
        return new Promise(resolve => {
            if (this.worker != undefined) {
                this.worker.postMessage({ command: 'ACCESS_TOKEN' });
                this.worker.onmessage = function (e: any) {
                    resolve(e.data);
                };
            }
            else {
                resolve('');
            }
        });
    }

    checkAccessToken(): Promise<boolean> {
        return new Promise(resolve => {
            if (this.worker != undefined) {
                this.worker.postMessage({ command: 'CHECK_ACCESS_TOKEN' });
                this.worker.onmessage = function (e: any) {
                    resolve(e.data);
                };
            }
            else {
                resolve(false);
            }
        });
    }

    storeTokenInWorker(tokenInfo: TokenInfo) {
        localStorage.setItem('STORE_TOKEN_ACCESS_TOKEN', tokenInfo.access_token);
        localStorage.setItem('STORE_TOKEN_REFRESH_TOKEN', tokenInfo.refresh_token);
        if (typeof Worker !== 'undefined') {
            // Create a new
            if (this.worker == undefined) {
                this.worker = new Worker(new URL('../app.worker', import.meta.url), { type: 'module' });
            }
            this.worker.postMessage({ command: 'STORE_TOKEN', access_token: tokenInfo.access_token, refresh_token: tokenInfo.refresh_token });
        } else {
            // Web Workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.

        }
    }
}
