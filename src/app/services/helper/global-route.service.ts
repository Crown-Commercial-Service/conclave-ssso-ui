import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GlobalRouteService {
    constructor() {}
    public globalRoute = '';
}