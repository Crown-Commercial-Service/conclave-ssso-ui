import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManageDelegateService {

  public delegatedOrg: BehaviorSubject<any> = new BehaviorSubject(null);
  private  organisationId: string;

    constructor(private AuthService:AuthService,private route: Router,) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
   }


  public ValueChanged(data: string, box: string, form: string): void {
    if (form === 'startdate') {
      if (box == 'start-day' && data.length > 1) {
        document.getElementById('start-month')?.focus();
      } else if (box == 'start-month' && data.length > 1) {
        document.getElementById('start-year')?.focus();
      }
    } else if (form === 'enddate') {
      if (box == 'end-day' && data.length > 1) {
        document.getElementById('end-month')?.focus();
      } else if (box == 'end-month' && data.length > 1) {
        document.getElementById('end-year')?.focus();
      }
    }
  }

  public tiggerBackspace(data: any, box: string, form: string): void {
    if (form === 'startdate') {
      if (box == 'start-year' && data.length == 0) {
        document.getElementById('start-month')?.focus();
      } else if (box == 'start-month' && data.length == 0) {
        document.getElementById('start-day')?.focus();
      }
    } else if (form === 'enddate') {
      if (box == 'end-year' && data.length == 0) {
        document.getElementById('end-month')?.focus();
      } else if (box == 'end-month' && data.length == 0) {
        document.getElementById('end-day')?.focus();
      }
    }
  }

  public SetInputFocus(inputIndex: string):void{
    document.getElementById(inputIndex)?.focus();

  }

  public setDelegatedOrg(org: any): void {
    localStorage.setItem('delegatedOrg', org);
    this.delegatedOrg.next(org)
    this.AuthService.renewAccessToken('/home')
    this.setPermissionOrgDetails()
  }

  public get getDelegatedOrg():any {
    return localStorage.getItem('delegatedOrg');
  }


  public setPermissionOrgDetails(){
    this.delegatedOrg.subscribe((data)=>{
    if(data == 0 || data == null){
     localStorage.setItem('permission_organisation_id',this.organisationId);
    }else{
      localStorage.setItem('permission_organisation_id',this.getDelegatedOrg);
    }
    // setTimeout(() => {
    //   console.log('Angular - Navigate to Home');
    //   this.route.navigateByUrl('/home');
    // }, 100);
    })
  }
  
}
