import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-user-status',
  templateUrl: './verify-user-status.component.html',
  styleUrls: ['./verify-user-status.component.scss']
})
export class VerifyUserStatusComponent implements OnInit {
  userInfo: any;
  userStatus:number=0
  constructor(private ActivatedRoute: ActivatedRoute, private titleService: Title) { }

  ngOnInit(): void {
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
        case 'INVALID_USER_DETAIL': {
          this.userStatus = 3
          this.titleService.setTitle(
            `${ 'User not created' }  - CCS`
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
