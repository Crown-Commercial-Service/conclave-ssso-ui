import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  
  public blockedScheme:any[] = environment.appSetting.blockedScheme

  public NominiData: BehaviorSubject<any> = new BehaviorSubject(null);

  public ManageGroup: BehaviorSubject<any> = new BehaviorSubject(this.GName);

  public userEditDetails: BehaviorSubject<any> = new BehaviorSubject(this.userName);


  public selectedRoleforGroup: BehaviorSubject<any> = new BehaviorSubject(this.roleForGroup);

  public manageGroupStorage(Gname: string): void {
    sessionStorage.setItem('Gname', Gname);
    this.ManageGroup.next(Gname)
  }

  public get GName() {
    return sessionStorage.getItem('Gname');
  }
  
   public get userName(){
    if(localStorage.getItem('userEditDetails') != null){
      return JSON.parse(localStorage.getItem('userEditDetails') || '')
    } else {
      return null
    }
   }

   public get roleForGroup(){
    if(localStorage.getItem('roleForGroup') != null){
      return JSON.parse(localStorage.getItem('roleForGroup') || '')
    } else {
      return null
    }
   }
  
   public storeUserDetails(userEditDetails:any){
    localStorage.setItem('userEditDetails', userEditDetails);
    this.userEditDetails.next(JSON.parse(localStorage.getItem('userEditDetails') || ''))
   }

   public storeRoleForGroup(roleForGroup:any){
    localStorage.setItem('roleForGroup', roleForGroup);
    this.selectedRoleforGroup.next(JSON.parse(localStorage.getItem('roleForGroup') || ''))
   }

   public checkBlockedScheme(item:any){
    return !this.blockedScheme.includes(item.scheme)
   }

   public checkBlockedSchemeText(item:any){
    return !this.blockedScheme.includes(item)
   }
  constructor() {}
}
