import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delegated-user-confirm',
  templateUrl: './delegated-user-confirm.component.html',
  styleUrls: ['./delegated-user-confirm.component.scss']
})
export class DelegatedUserConfirmComponent implements OnInit {
  public userDetails:any={}
  constructor(private route:Router,private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userDetails = JSON.parse(atob(para.data));
      console.log("this.RouteData", this.userDetails)
    });
  }


  public UpdateDelegateToUser():void{
    let data ={
      status:'003'
    }
    this.route.navigateByUrl('delegated-success?data=' +btoa(JSON.stringify(data)))
  }
}
