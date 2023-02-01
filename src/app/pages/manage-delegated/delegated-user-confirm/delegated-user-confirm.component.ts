import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

@Component({
  selector: 'app-delegated-user-confirm',
  templateUrl: './delegated-user-confirm.component.html',
  styleUrls: ['./delegated-user-confirm.component.scss']
})
export class DelegatedUserConfirmComponent implements OnInit {
  public userInfo: any = {}
  public UserSelectedinfo: any;
  public pageAccessMode=''
  constructor(private route: Router, private ActivatedRoute: ActivatedRoute, private DelegatedService: WrapperUserDelegatedService,private titleService: Title,) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data)).userDetails;
      this.userInfo.userName = decodeURIComponent(unescape(this.userInfo.userName));
      this.UserSelectedinfo = JSON.parse(atob(para.data));
      this.UserSelectedinfo.userName = decodeURIComponent(unescape(this.UserSelectedinfo.userName));
      this.pageAccessMode = this.UserSelectedinfo.userDetails.pageaccessmode
    });
    if (this.pageAccessMode === "edit") {
      this.titleService.setTitle(
        `${ 'Confirm Delegation'}  - CCS`
      );
    } else {
      this.titleService.setTitle(
        `${ 'Confirm Delegation'}  - CCS`
      );
    }
  
  }



  public onSubmit(): void {
    if (this.pageAccessMode === "edit") {
      this.updateDelegatedUser()
    } else {
      this.createDelegateUser()
    }
  }

  public createDelegateUser(): void {
    delete this.UserSelectedinfo.userDetails
    delete this.UserSelectedinfo.roleDetails
    sessionStorage.removeItem('deleagted_user_details')
    const startDate = this.UserSelectedinfo.detail.startDate.split('-')
    const endDate = this.UserSelectedinfo.detail.endDate.split('-')
    if (startDate[1].length <= 1) {
      startDate[1] = 0 + startDate[1]
    }
    if (startDate[2].length <= 1) {
      startDate[2] = 0 + startDate[2]
    }
    if (endDate[1].length <= 1) {
      endDate[1] = 0 + endDate[1]
    }
    if (endDate[2].length <= 1) {
      endDate[2] = 0 + endDate[2]
    }
    this.UserSelectedinfo.detail.startDate=startDate[0] + '-'+startDate[1] + '-'+startDate[2]
    this.UserSelectedinfo.detail.endDate=endDate[0]+ '-'+ endDate[1] + '-'+ endDate[2]
    this.DelegatedService.createDelegatedUser(this.UserSelectedinfo).subscribe({
      next: (roleListResponse: any) => {
        let data ={
          status:'create',
          userName:this.UserSelectedinfo.userName
        }
        data.userName = escape(encodeURIComponent(data.userName));
        this.route.navigateByUrl('delegated-success?data=' +btoa(JSON.stringify(data)))
      },
      error: (error: any) => { 
        this.route.navigateByUrl('delegated-error')
      },
    });
  }

  public updateDelegatedUser(): void {
    delete this.UserSelectedinfo.userDetails
    delete this.UserSelectedinfo.roleDetails
    sessionStorage.removeItem('deleagted_user_details')
    const startDate = this.UserSelectedinfo.detail.startDate.split('-')
    const endDate = this.UserSelectedinfo.detail.endDate.split('-')
    if (startDate[1].length <= 1) {
      startDate[1] = 0 + startDate[1]
    }
    if (startDate[2].length <= 1) {
      startDate[2] = 0 + startDate[2]
    }
    if (endDate[1].length <= 1) {
      endDate[1] = 0 + endDate[1]
    }
    if (endDate[2].length <= 1) {
      endDate[2] = 0 + endDate[2]
    }
    this.UserSelectedinfo.detail.startDate=startDate[0] + '-'+ startDate[1] + '-'+ startDate[2]
    this.UserSelectedinfo.detail.endDate=endDate[0] + '-'+ endDate[1] + '-'+ endDate[2]
    this.DelegatedService.updateDelegatedUser(this.UserSelectedinfo).subscribe({
      next: (roleListResponse: any) => {
        let data = {
          status: 'update',
          userName: this.UserSelectedinfo.userName
        }
        data.userName = escape(encodeURIComponent(data.userName));
        this.route.navigateByUrl('delegated-success?data=' + btoa(JSON.stringify(data)))
      },
      error: (error: any) => {
        this.route.navigateByUrl('delegated-error')
      },
    });
  }

  public onClickNevigation(path:string):void{
    this.route.navigateByUrl(path)
    sessionStorage.removeItem('deleagted_user_details')
  }
  
  public Cancel() {
    window.history.back();
  }
}
