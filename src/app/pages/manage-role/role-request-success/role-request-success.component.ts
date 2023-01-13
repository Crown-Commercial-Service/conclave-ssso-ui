import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-role-request-success',
  templateUrl: './role-request-success.component.html',
  styleUrls: ['./role-request-success.component.scss']
})
export class RoleRequestSuccessComponent implements OnInit {

  public userInfo:any;
  public isOrgAdmin: boolean = false;

  constructor(private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data));
    });
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
  }

  public goBack():void{
    window.history.back()
  }

}
