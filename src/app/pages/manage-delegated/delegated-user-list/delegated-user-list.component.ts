import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UserListResponse } from 'src/app/models/user';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { environment } from 'src/environments/environment';
import { AuthService } from "src/app/services/auth/auth.service";
import { SessionService } from 'src/app/shared/session.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UserListInfo } from 'src/app/models/user';

@Component({
  selector: 'app-delegated-user-list',
  templateUrl: './delegated-user-list.component.html',
  styleUrls: ['./delegated-user-list.component.scss'],
})
export class DelegatedUserListComponent implements OnInit ,OnDestroy {
  public searchText: string = '';
  public searchSumbited: boolean = false;
  public tabConfig = {
    currentusers: true,
    expiredusers: false
  }
  public organisationId: string = '';
  public currentUserstableConfig: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['NAME', 'EMAIL','Start date','End date','Organisation'],
    usersColumnsToDisplay: ['name', 'userName', 'startDate','endDate', 'originOrganisation'],
    userList: '',
    pageName: 'Delegatedaccess',
    hyperTextrray: ['Remove', 'Edit']
  }

  public expiredUserstableConfig: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['NAME', 'EMAIL', 'Expiry date', 'Organisation'],
    usersColumnsToDisplay: ['name', 'userName', 'endDate', 'originOrganisation'],
    userList: '',
    pageName: 'Delegatedaccess',
    hyperTextrray: ['View']
  }

  constructor(public router: Router, private WrapperUserDelegatedService: WrapperUserDelegatedService, private sessionService:SessionService,
               public route: ActivatedRoute,private dataLayerService: DataLayerService, private authService: AuthService, protected scrollHelper: ScrollHelper,) {

    this.organisationId = localStorage.getItem('cii_organisation_id') || ''
    this.currentUserstableConfig.userList = {
      currentPage: this.currentUserstableConfig.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
    this.expiredUserstableConfig.userList = {
      currentPage: this.currentUserstableConfig.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
  }


  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
    this.tabChanged(sessionStorage.getItem('activetab') || 'currentusers')
    setTimeout(() => {
      this.getOrganisationExpiredUsers()
    }, 10);
    this.getOrganisationCurrentUsers()

    this.route.queryParams.subscribe(params => {
      if (params['isNewTab'] === 'true') {
        const urlTree = this.router.parseUrl(this.router.url);
        delete urlTree.queryParams['isNewTab'];
        this.router.navigateByUrl(urlTree.toString(), { replaceUrl: true });
      }
    });
  }

  public onSearchClick(): void {
    this.searchSumbited = true
    setTimeout(() => {
      this.getOrganisationExpiredUsers()
    }, 10);
    this.getOrganisationCurrentUsers()
  }


  public onLinkClick(data: any): void {
    if (data.event.target.innerText === "Remove") {
      data.pageaccessmode = 'remove'
      data.userName = escape(encodeURIComponent(data.userName));
      this.router.navigateByUrl('delegated-remove-confirm?data=' + btoa(JSON.stringify(data)));
    } else {
      data.pageaccessmode = 'edit'
      data.userName = escape(encodeURIComponent(data.userName));
      this.router.navigateByUrl('delegate-access-user?data=' + btoa(JSON.stringify(data)));
    }
  }

  public OnClickView(event: UserListInfo) {
    let data = {
      header: 'View expired delegated access',
      Description: '',
      Breadcrumb: 'View expired delegated access',
      status: '003',
      event: event
    }
    data.event.userName = escape(encodeURIComponent(data.event.userName));
    this.router.navigateByUrl('delegated-user-status?data=' + btoa(JSON.stringify(data)))
  }

  setPagecurrentUsers(pageNumber: any) {
    this.currentUserstableConfig.currentPage = pageNumber;
    this.getOrganisationCurrentUsers();
  }
  
  setPageexpiredUsers(pageNumber: any) {
    this.expiredUserstableConfig.currentPage = pageNumber;
    this.getOrganisationExpiredUsers();
  }

  public FindDelegateUser(buttonText:string): void {
    this.router.navigateByUrl('find-delegated-user');
   this.dataLayerService.pushClickEvent(buttonText)
  }

  getOrganisationCurrentUsers() {
    this.WrapperUserDelegatedService.GetCurrentUsers(this.organisationId, this.searchText, this.currentUserstableConfig.currentPage, this.currentUserstableConfig.pageSize).subscribe({
      next: (userListResponse: UserListResponse) => {
        if (userListResponse != null) {
          this.currentUserstableConfig.userList = userListResponse;
          this.currentUserstableConfig.pageCount = this.currentUserstableConfig.userList.pageCount;
          console.log(this.currentUserstableConfig);
          Array.from(this.currentUserstableConfig.userList.userList).forEach((f: any) => {        
                  f.pageaccessmode = 'edit';
                  let queryParams = { data: btoa(JSON.stringify(f)),isNewTab:true };
                  f.routeLink = `/delegate-access-user`;
                  f.routeData = queryParams;
            
                let datas={
                  "servicePermissionInfo":f.servicePermissionInfo=
                  {
                    "id": f.id,
                    "name": f.name,
                    "key": f.key
                  },
                  "id": f.id,
                  "name": f.name,
                  "userName":f.userName,
                  "remainingDays":f.remainingDays,
                  "startDate": f.startDate,
                  "endDate":f.endDate,
                  "originOrganisation":f.originOrganisation,
                  "delegationAccepted":f.delegationAccepted,  
                  "isAdmin":f.isAdmin,           
                  "isDormant":f.isDormant,
                  "pageaccessmode":"remove"
                }

                let queryDeclineParams = { data: btoa(JSON.stringify(datas)),isNewTab: true };
                console.log("datas",datas);
                f.pageaccessmode = 'remove';
                f.declineRouteLink = `/delegated-remove-confirm`;
                f.declineRouteData = queryDeclineParams;
          });
        }
      },
      error: (error: any) => {
        if (error?.status == 401) {
          this.authService.logOutAndRedirect();
        }
        else{
          this.router.navigateByUrl('delegated-error')
        }
      }
    });
  }


  getOrganisationExpiredUsers() {
    this.WrapperUserDelegatedService.GetExpiredUsers(this.organisationId, this.searchText, this.expiredUserstableConfig.currentPage, this.expiredUserstableConfig.pageSize).subscribe({
      next: (userListResponse: UserListResponse) => {
        if (userListResponse != null) {
          this.expiredUserstableConfig.userList = userListResponse;
          this.expiredUserstableConfig.pageCount = this.expiredUserstableConfig.userList.pageCount;
          Array.from(this.expiredUserstableConfig.userList.userList).forEach((f: any)=>{
            let data: any= {
              header: 'View expired delegated access',
              Description: '',
              Breadcrumb: 'View expired delegated access',
              status: '003',
              event: f
            }
              //data.event.userName = escape(encodeURIComponent(data.event.userName));
              let queryParams = {data: btoa(JSON.stringify(data)),isNewTab: true}
               f.routeLink= `/delegated-user-status`,
               f.routeData = queryParams
          })
        }
      },
      error: (error: any) => {
        if (error?.status == 401) {
          this.authService.logOutAndRedirect();
        }
        else{
        this.router.navigateByUrl('delegated-error')
        }
      }
    });
  }



  public tabChanged(activetab: string): void {
    if (activetab === 'currentusers') {
      this.tabConfig.currentusers = true
      this.tabConfig.expiredusers = false
    } else {
      this.tabConfig.expiredusers = true
      this.tabConfig.currentusers = false
    }
 
    this.dataLayerService.pushEvent({
      event: "tab_navigation",
      link_text: activetab === 'currentusers' ? "Current users with delegated access to your Organisation": "Users with expired delegated access to your Organisation"
    })
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('activetab')
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }
}
