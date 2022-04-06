import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  public NominiData: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }
}
