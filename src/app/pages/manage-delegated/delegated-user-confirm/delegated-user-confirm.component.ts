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
      console.log("this.RouteData", this.UserSelectedinfo)
    });
  }


  public UpdateDelegateToUser():void{
    delete this.UserSelectedinfo.userDetails
    delete this.UserSelectedinfo.roleDetails
    this.DelegatedService.createDelegatedUser(this.UserSelectedinfo).subscribe({
      next: (roleListResponse: any) => {
        let data ={
          status:'003',
          userName:this.UserSelectedinfo.userName
        }
        this.route.navigateByUrl('delegated-success?data=' +btoa(JSON.stringify(data)))
      },
      error: (error: any) => { },
    });
  }


  public Cancel() {
    window.history.back();
  }
}
