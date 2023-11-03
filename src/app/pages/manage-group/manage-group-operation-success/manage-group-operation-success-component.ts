import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { environment } from 'src/environments/environment';
import {
  OrganisationGroupResponseInfo,
  pendingApprovalResponce,
} from 'src/app/models/organisationGroup';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-manage-group-operation-success',
  templateUrl: './manage-group-operation-success-component.html',
  styleUrls: ['./manage-group-operation-success-component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
})
export class ManageGroupOperationSuccessComponent
  extends BaseComponent
  implements OnInit {
  public GroupName: string = '';
  operation: OperationEnum;
  operationEnum = OperationEnum;
  isEdit: boolean = false;
  groupId: any = '';
  userCount: number = 0;
  roleCount: number = 0;
  public showRoleView: boolean = environment.appSetting.hideSimplifyRole;
  public accordinData: any = {
    showAccordin1: false,
    showAccordin2: false,
  };
  public group!: OrganisationGroupResponseInfo;
  organisationId: string;
  pendingVerificationUser: pendingApprovalResponce;
  verifiedUser: pendingApprovalResponce;
  public accordionStatus=false
  tableSetting = {
    usersTableHeaders: ['NAME', 'EMAIL'],
    usersColumnsToDisplay: ['name', 'userId'],
  };
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private SharedDataService: SharedDataService,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private orgGroupService: WrapperOrganisationGroupService,
    private dataLayerService: DataLayerService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.operation = parseInt(
      this.activatedRoute.snapshot.paramMap.get('operation') || '0'
    );
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.data) {
      let routeData = JSON.parse(queryParams.data);
      this.isEdit = routeData['isEdit'];
      this.groupId = routeData['groupId'];
      this.userCount = routeData['userCount'] || 0;
      this.roleCount = routeData['roleCount'] || 0;
    }
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.SharedDataService.ManageGroup.subscribe((data) => {
      this.GroupName = data;
    });
    this.pendingVerificationUser = {
      currentPage: 1,
      pageCount: 0,
      rowCount: 0,
      groupUser: [],
    };
    this.verifiedUser = {
      currentPage: 1,
      pageCount: 0,
      rowCount: 0,
      groupUser: [],
    };
  }

  ngOnInit() {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
          operation: this.operation
      });
    })
    let area: string = '';
    switch (this.operation) {
      case this.operationEnum.GroupAdd:
        area = 'Create';
        break;
      case this.operationEnum.GroupNameUpdate:
        area = 'Edit Name';
        break;
      case this.operationEnum.GroupUserAdd:
        area = 'Add Users';
        break;
      case this.operationEnum.GroupUserUpdate:
        area = 'Add/Remove Users';
        break;
      case this.operationEnum.GroupRoleUpdate:
        if (this.showRoleView) {
          area = 'Add/Remove Roles';
        } else {
          area = 'Add or remove services';
        }
        break;
      case this.operationEnum.GroupDelete:
        area = 'Delete';
        break;
      default:
        break;
    }
    this.titleService.setTitle(`Success - ${area} - Manage Groups - CCS`);
    this.getUserList()
  }

  getUserList(){
    const isGroupOperation = this.isGroupOperation()
    if(isGroupOperation){
      this.getListOfUserRequiredAccess();
    }
  }


  onNavigateToGroupClick() {
    let data = {
      isEdit: true,
      groupId: this.groupId,
    };
    this.router.navigateByUrl(
      'manage-groups/view?data=' + JSON.stringify(data)
    );
  }
  public onNavigateTohome() {
    this.router.navigateByUrl('/home');
  }

  public onNavigateTomanageGroup() {
    this.router.navigateByUrl('/manage-groups');
  }

  setPagePendingUsers(pageNumber: any) {
    this.pendingVerificationUser.currentPage = pageNumber;
    this.getListOfUserRequiredAccess();
  }

  setPageApprovedUsers(pageNumber: any) {
    this.verifiedUser.currentPage = pageNumber;
    this.getListOfUsersGivenAccess();
  }

  public getListOfUserRequiredAccess(): void {
    this.orgGroupService
      .getPendingApproveOrganisationGroup(
        this.organisationId,
        this.groupId,
        this.pendingVerificationUser.currentPage,
        5,
        true
      )
      .subscribe(
        (groupData: any) => {
          this.pendingVerificationUser = groupData;
          this.pendingVerificationUser.pageCount = this.pendingVerificationUser.pageCount;
          this.getListOfUsersGivenAccess();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public getListOfUsersGivenAccess(): void {
    this.orgGroupService
      .getPendingApproveOrganisationGroup(
        this.organisationId,
        this.groupId,
        this.verifiedUser.currentPage,
        5,
        false
      )
      .subscribe(
        (groupData: any) => {
          this.verifiedUser = groupData;
          this.verifiedUser.pageCount = this.verifiedUser.pageCount;
          this.checkAccordionStatus()
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public checkAccordionStatus(){
    const isGroupOperation = this.isGroupOperation()
    const hasUsers =  this.pendingVerificationUser.groupUser.length > 0;
    this.accordionStatus = isGroupOperation && hasUsers;
  }

  public isGroupOperation(){
    return [this.operationEnum.GroupRoleUpdate, this.operationEnum.GroupAdd,this.operationEnum.GroupUserUpdate].includes(this.operation);
  }

  public toggleAccordion(accordin: string): void {
    if (accordin === 'accordin1') {
      this.accordinData.showAccordin1 = !this.accordinData.showAccordin1;
    } else if (accordin === 'accordin2') {
      this.accordinData.showAccordin2 = !this.accordinData.showAccordin2;
    }
  }
}
