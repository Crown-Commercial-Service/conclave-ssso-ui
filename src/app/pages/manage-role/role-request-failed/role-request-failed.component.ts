import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-role-request-failed',
  templateUrl: './role-request-failed.component.html',
  styleUrls: ['./role-request-failed.component.scss']
})
export class RoleRequestFailedComponent implements OnInit {

  public userInfo:any;
  public isOrgAdmin: boolean = false;
  public errorCode: any = '';

  constructor(private ActivatedRoute: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data));
      this.errorCode = this.userInfo.responce.status;
    });
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
  }

  public goBack():void{
    window.history.back()
  }
}
