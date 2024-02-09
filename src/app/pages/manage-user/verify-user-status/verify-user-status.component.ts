import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-verify-user-status',
  templateUrl: './verify-user-status.component.html',
  styleUrls: ['./verify-user-status.component.scss']
})
export class VerifyUserStatusComponent implements OnInit {
  public isOrgAdmin: boolean = false;
  public userInfo: any;
  public userStatus:number=0
  constructor(private ActivatedRoute: ActivatedRoute,private sessionService:SessionService, private titleService: Title, private router: Router, private dataLayerService: DataLayerService) { 
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
  }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data));
      console.log("this.userInfo",this.userInfo)
      switch (this.userInfo.status) {
        case "ERROR_USER_ALREADY_EXISTS": {
          this.userStatus = 0
          this.titleService.setTitle(
            `${ 'Account already created' }  - CCS`
          );
          break;
        }
        case 'UNAUTHORIZED': {
          this.userStatus = 1
          this.titleService.setTitle(
            `${ 'User not created' }  - CCS`
          );
          break;
        }
        case 'ERROR_LINK_EXPIRED': {
          this.userStatus = 2
          this.titleService.setTitle(
            `${ 'User not created' }  - CCS`
          );
          break;
        }
        case 'INVALID_USER_DETAIL': {
          this.userStatus = 3
          this.titleService.setTitle(
            `${ 'Error' }  - CCS`
          );
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    });
  }

}
