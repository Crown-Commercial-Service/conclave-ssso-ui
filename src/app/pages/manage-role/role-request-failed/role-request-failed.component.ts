import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-role-request-failed',
  templateUrl: './role-request-failed.component.html',
  styleUrls: ['./role-request-failed.component.scss']
})
export class RoleRequestFailedComponent implements OnInit {

  public userInfo:any;
  public isOrgAdmin: boolean = false;
  public errorCode: any = '';

  constructor(private ActivatedRoute: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data));
      this.errorCode = this.userInfo.responce.status;
    });
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.dataLayerService.pushPageViewEvent();
  }

  public goBack():void{
    window.history.back()
  }
}
