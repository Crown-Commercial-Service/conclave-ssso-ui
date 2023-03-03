import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SessionStorageKey } from 'src/app/constants/constant';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-operation-success',
    templateUrl: './operation-success.component.html',
    styleUrls: ['./operation-success.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class OperationSuccessComponent extends BaseComponent implements OnInit {
    public showRoleView:boolean = environment.appSetting.hideSimplifyRole
    operation: OperationEnum;
    userServiceTableHeaders = ['NAME'];
    userServiceColumnsToDisplay = ['accessRoleName',]
    operationEnum = OperationEnum;
    userName: string = '';
    isOrgAdmin: boolean = false;
    public approveRequiredRole:any=[]
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title,
        protected uiStore: Store<UIState>, private authService: AuthService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        this.operation = parseInt(this.activatedRoute.snapshot.paramMap.get('operation') || '0');
        this.userName = sessionStorage.getItem(SessionStorageKey.OperationSuccessUserName) ?? '';
        this.approveRequiredRole = this.getSelectedRole(JSON.parse(localStorage.getItem('user_approved_role') || 'null' ))
    }


    public getSelectedRole(role:any):void{
      if(this.approveRequiredRole != null){
        let data:any=[]  
        role.forEach((f:any)=>{
          let obj = {
          accessRoleName: f.roleName,
          serviceName: f.serviceName,
          description:f.description,
          serviceView:!this.showRoleView
          }
          data.push(obj)
        })
        return data
      }  
    } 


    ngOnInit() {
        this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
        let area: string = "";
        switch (this.operation) {
            case this.operationEnum.MyAccountUpdate:
                area = 'Edit - My Profile'
                break;
            case this.operationEnum.MyAccountContactCreate:
                area = 'Add - User Contact'
                break;
            case this.operationEnum.MyAccountContactUpdate:
                area = 'Edit - User Contact'
                break;
            case this.operationEnum.MyAccountContactDelete:
                area = 'Delete - User Contact'
                break;
            case this.operationEnum.PasswordChanged:
                area = 'Change Password - My Profile'
                break;
            case this.operationEnum.UserCreate:
            case this.operationEnum.UserCreateWithIdamRegister:
                area = 'Add - Manage Users'
                break;
            case this.operationEnum.UserUpdate:
            case this.operationEnum.UserUpdateWithIdamRegister:
                area = 'Edit - Manage Users'
                break;
            case this.operationEnum.UserPasswordChange:
                area = 'Reset Password - Manage Users'
                break;
            case this.operationEnum.UserDelete:
                area = 'Delete - Manage Users'
                break;
            default:
                break
        }
        this.titleService.setTitle(`Success - ${area} - CCS`);
    }

    onNavigateToProfileClick() {
        this.router.navigateByUrl("profile");
    }

    onNavigateToSignInClick() {
        this.authService.logOutAndRedirect();
    }

    onNavigateToManageUserClick() {
        this.router.navigateByUrl("manage-users");
    }
}
