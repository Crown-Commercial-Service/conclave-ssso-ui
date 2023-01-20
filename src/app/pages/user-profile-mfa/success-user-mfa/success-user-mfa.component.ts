import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-user-mfa',
  templateUrl: './success-user-mfa.component.html',
  styleUrls: ['./success-user-mfa.component.scss']
})
export class SuccessUserMfaComponent implements OnInit {
  public decodedData: any = {};
  public sendError: boolean=false
  isOrgAdmin: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.route.queryParams.subscribe((para:any)=>{
      if(para.data){
        let RouteData = JSON.parse(atob(para.data));
        this.decodedData=RouteData
      }else if(para.error){
        this.sendError=true
      }
    })
  }
}
