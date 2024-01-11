import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-role-request-success',
  templateUrl: './role-request-success.component.html',
  styleUrls: ['./role-request-success.component.scss']
})
export class RoleRequestSuccessComponent implements OnInit {

  public userInfo:any;
  public isOrgAdmin: boolean = false;
  public showRoleView:boolean = environment.appSetting.hideSimplifyRole

  constructor(private ActivatedRoute: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data));
    });
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.dataLayerService.pushPageViewEvent();
  }

  public goBack():void{
    window.history.back()
  }

}
