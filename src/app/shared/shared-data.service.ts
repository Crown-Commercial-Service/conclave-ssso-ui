import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  // public GName:any=''

  public NominiData: BehaviorSubject<any> = new BehaviorSubject(null);

  public ManageGroup: BehaviorSubject<any> = new BehaviorSubject(this.GName);

  public userEditDetails: BehaviorSubject<any> = new BehaviorSubject(JSON.parse(localStorage.getItem('userEditDetails') || ''));

  public manageGroupStorage(Gname: string): void {
    sessionStorage.setItem('Gname', Gname);
    this.ManageGroup.next(Gname)
  }

  public get GName() {
    return sessionStorage.getItem('Gname');
  }

   public storeUserDetails(userEditDetails:any){
    localStorage.setItem('userEditDetails', userEditDetails);
    this.userEditDetails.next(JSON.parse(localStorage.getItem('userEditDetails') || ''))
   }

  constructor() {}
}
