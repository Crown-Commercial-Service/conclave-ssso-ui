import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-role-request-failed',
  templateUrl: './role-request-failed.component.html',
  styleUrls: ['./role-request-failed.component.scss']
})
export class RoleRequestFailedComponent implements OnInit {

  public userInfo:any;
  public isOrgAdmin: boolean = false;
  public errorCode: any = '';

  constructor(private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data));
      this.errorCode = this.userInfo.responce.status;
    });
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
  }

  public goBack():void{
    window.history.back()
  }
}
