import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

@Component({
  selector: 'app-delegated-user-confirm',
  templateUrl: './delegated-user-confirm.component.html',
  styleUrls: ['./delegated-user-confirm.component.scss']
})
export class DelegatedUserConfirmComponent implements OnInit {
  public userInfo:any={}
  public UserSelectedinfo:any;
  constructor(private route:Router,private ActivatedRoute: ActivatedRoute,private DelegatedService: WrapperUserDelegatedService) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data)).userDetails;
      this.UserSelectedinfo= JSON.parse(atob(para.data))
    });
  }



  public onSubmit():void{
   if(this.UserSelectedinfo.userDetails.pageaccessmode === "edit"){
    this.updateDelegatedUser()
   }else{
    this.createDelegateUser()
   }
  }

  public createDelegateUser():void{
    delete this.UserSelectedinfo.userDetails
    delete this.UserSelectedinfo.roleDetails
    sessionStorage.removeItem('deleagted_user_details')
    this.DelegatedService.createDelegatedUser(this.UserSelectedinfo).subscribe({
      next: (roleListResponse: any) => {
        let data ={
          status:'create',
          userName:this.UserSelectedinfo.userName
        }
        this.route.navigateByUrl('delegated-success?data=' +btoa(JSON.stringify(data)))
      },
      error: (error: any) => { 
        this.route.navigateByUrl('delegated-error')
      },
    });
  }

  public updateDelegatedUser():void{
    delete this.UserSelectedinfo.userDetails
    delete this.UserSelectedinfo.roleDetails
    sessionStorage.removeItem('deleagted_user_details')
    this.DelegatedService.updateDelegatedUser(this.UserSelectedinfo).subscribe({
      next: (roleListResponse: any) => {
        let data ={
          status:'update',
          userName:this.UserSelectedinfo.userName
        }
        this.route.navigateByUrl('delegated-success?data=' +btoa(JSON.stringify(data)))
      },
      error: (error: any) => { 
        this.route.navigateByUrl('delegated-error')
      },
    });
  }


  public Cancel() {
    window.history.back();
  }
}
