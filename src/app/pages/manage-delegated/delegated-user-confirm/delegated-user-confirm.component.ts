import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delegated-user-confirm',
  templateUrl: './delegated-user-confirm.component.html',
  styleUrls: ['./delegated-user-confirm.component.scss']
})
export class DelegatedUserConfirmComponent implements OnInit {
  public userInfo: any = {}
  public UserSelectedinfo: any;
  public pageAccessMode = ''
  public hideSimplifyRole = environment.appSetting.hideSimplifyRole;
  public delegationRolesTable: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    rolesTableHeaders :['NAME'],
    rolesColumnsToDisplay : ['accessRoleName'],
    data: '',
    pageName: 'Contactadmin',
  }
  constructor(private route: Router, private ActivatedRoute: ActivatedRoute, private DelegatedService: WrapperUserDelegatedService, private titleService: Title,) { 
    this.delegationRolesTable.details = {
      currentPage: this.delegationRolesTable.currentPage,
      pageCount: 0,
      rowCount: 0,
      data: [],
    };
  }

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
        `Confirm Delegation - CCS`
      );
    } else {
      this.titleService.setTitle(
        `Confirm Delegation - CCS`
      );
    }
   this.getSelectedRole()
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
    this.exchangeGroupAndRole();
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
    this.UserSelectedinfo.detail.startDate = startDate[0] + '-' + startDate[1] + '-' + startDate[2]
    this.UserSelectedinfo.detail.endDate = endDate[0] + '-' + endDate[1] + '-' + endDate[2]
    this.DelegatedService.createDelegatedUser(this.UserSelectedinfo).subscribe({
      next: (roleListResponse: any) => {
        let data = {
          status: 'create',
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

  public updateDelegatedUser(): void {
    delete this.UserSelectedinfo.userDetails
    delete this.UserSelectedinfo.roleDetails
    this.exchangeGroupAndRole();
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
    this.UserSelectedinfo.detail.startDate = startDate[0] + '-' + startDate[1] + '-' + startDate[2]
    this.UserSelectedinfo.detail.endDate = endDate[0] + '-' + endDate[1] + '-' + endDate[2]
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

  public getSelectedRole(): any[] {
    let data: any = []
    this.UserSelectedinfo?.roleDetails.forEach((f: any) => {
      let obj =
      {
        accessRoleName: f.accessRoleName,
        description: f.description,
        serviceView: true
      }
      this.delegationRolesTable.details.data.push(obj)
    })
    return data
  }


  private exchangeGroupAndRole() {
    if (!environment.appSetting.hideSimplifyRole) {
      this.UserSelectedinfo.detail.serviceRoleGroupIds = this.UserSelectedinfo.detail.roleIds;
      delete this.UserSelectedinfo.detail.roleIds;
    }
  }

  public onClickNevigation(path: string): void {
    this.route.navigateByUrl(path)
    sessionStorage.removeItem('deleagted_user_details')
  }

  public Cancel() {
    window.history.back();
  }
}
