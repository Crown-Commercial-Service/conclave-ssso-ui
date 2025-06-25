import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingIndicatorService {
    // public isLoading = new BehaviorSubject<boolean>(false);
    //public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public isCustomLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {}
}


