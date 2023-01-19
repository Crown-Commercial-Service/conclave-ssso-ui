import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocationStrategy, ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserEditResponseInfo, UserGroup, UserProfileRequestInfo } from 'src/app/models/user';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { WrapperUserContactService } from 'src/app/services/wrapper/wrapper-user-contact.service';
import {
  ContactGridInfo,
  UserContactInfoList,
} from 'src/app/models/contactInfo';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationEnum } from 'src/app/constants/enum';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { Role } from 'src/app/models/organisationGroup';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuditLoggerService } from 'src/app/services/postgres/logger.service';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';
import { SessionStorageKey } from 'src/app/constants/constant';
import { PatternService } from 'src/app/shared/pattern.service';
import { isBoolean } from 'lodash';
import { environment } from 'src/environments/environment';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile-component.html',
  styleUrls: ['./user-profile-component.scss'],
})
export class UserProfileComponent extends FormBaseComponent implements OnInit {
  submitted!: boolean;
  formGroup!: FormGroup;
  userGroupTableHeaders = ['GROUPS'];
  userGroupColumnsToDisplay = ['group'];
  userRoleTableHeaders = ['ROLES', 'SERVICE'];
  userRoleColumnsToDisplay = [
    'accessRoleName',
    'serviceName',
  ];
  contactTableHeaders = [
    'CONTACT_REASON',
    'NAME',
    'EMAIL',
    'TELEPHONE_NUMBER',
    'MOBILE_NUMBER',
    'FAX',
    'WEB_URL',
  ];
  contactColumnsToDisplay = [
    'contactReason',
    'name',
    'email',
    'phoneNumber',
    'mobileNumber',
    'fax',
    'webUrl',
  ];
  public detailsData: any = [];
  public isAdminUser: boolean = false;
  userGroups: UserGroup[] = [];
  public approveRequiredRole: Role[];
  public pendingRoleDetails: any =[]
  public selectedApproveRequiredRole: any = []
  public pendingRoledeleteDetails: any = []
  public organisationDetails: any = {}
  private userRequest: any = {}
  isInvalidDomain: boolean = false
  userContacts: ContactGridInfo[] = [];
  userName: string;
  organisationId: string;
  canChangePassword: boolean = false;
  identityProviderDisplayName: string = '';
  roleDataList: any[] = [];
  assignedRoleDataList: any[] = [];
  routeStateData: any = {};
  hasGroupViewPermission: boolean = false;
  isOrgAdmin: boolean = false;
  private selectedRoleIds:number[] = [];
  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    private userService: WrapperUserService,
    private userContactService: WrapperUserContactService,
    private locationStrategy: LocationStrategy,
    protected uiStore: Store<UIState>,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private PatternService: PatternService,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private orgGroupService: WrapperOrganisationGroupService,
    private contactHelper: ContactHelper,
    private authService: AuthService,
    private auditLogService: AuditLoggerService,
    private organisationService: WrapperOrganisationService
  ) {
    super(
      viewportScroller,
      formBuilder.group({
        firstName: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z][a-z A-Z,.'-]*(?:\s+[a-zA-Z]+)?$")])],
        lastName: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z][a-z A-Z,.'-]*(?:\s+[a-zA-Z]+)?$")])],
        mfaEnabled: [false],
      })
    );
    this.userName = localStorage.getItem('user_name') || '';
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.routeStateData = this.router.getCurrentNavigation()?.extras.state;
    this.approveRequiredRole = []
    this.locationStrategy.onPopState(() => {
      this.onCancelClick();
    });
  }

  async ngOnInit() {
    sessionStorage.removeItem(SessionStorageKey.UserContactUsername);
    await this.auditLogService
      .createLog({
        eventName: 'Access',
        applicationName: 'Manage-my-account',
        referenceData: `UI-Log`,
      })
      .toPromise();
    let user = await this.userService.getUser(this.userName).toPromise();
    if (user != null) {
      this.canChangePassword = user.detail.canChangePassword;
      if (!environment.appSetting.hideIDP) {
        this.identityProviderDisplayName =
          user.detail.identityProviders
            ?.map((idp) => idp.identityProviderDisplayName)
            .join(',') || '';
      } else {
        this.identityProviderDisplayName = 'User ID and password'
      }
      this.userGroups = user.detail.userGroups || [];
      this.userGroups = this.userGroups.filter(
        (group, index, self) =>
          self.findIndex(
            (t) => t.groupId === group.groupId && t.group === group.group
          ) === index
      );
      if (this.routeStateData != undefined) {
        this.formGroup.setValue({
          firstName: this.routeStateData.firstName,
          lastName: this.routeStateData.lastName,
          mfaEnabled: user.mfaEnabled,
        });
      } else {
        this.formGroup.setValue({
          firstName: user.firstName,
          lastName: user.lastName,
          mfaEnabled: user.mfaEnabled,
        });
      }
    }
    await this.getApprovalRequriedRoles()
    await this.getPendingApprovalUserRole();
    await this.getOrgDetails()
    await this.orgGroupService
      .getOrganisationRoles(this.organisationId)
      .toPromise()
      .then((orgRoles: Role[]) => {
             orgRoles.map((r:Role,index) =>{
              let userRole =
              user.detail.rolePermissionInfo &&
              user.detail.rolePermissionInfo.some(
                (rp) => rp.roleId == r.roleId
              );
              if(userRole){
                if ( r.roleKey == 'ORG_ADMINISTRATOR' && this.isAdminUser == false) {
                  this.isAdminUser = true;
                }
                this.formGroup.addControl(
                  'orgRoleControl_' + r.roleId,
                  this.formBuilder.control(this.assignedRoleDataList ? true : '')
                );
              } else  {
                let PendinguserRole = this.pendingRoleDetails.some(
                  (pendingRole: any) => pendingRole.roleKey == r.roleKey
                );
                this.formGroup.addControl(
                  'orgRoleControl_' + r.roleId,
                  this.formBuilder.control(userRole ? true : PendinguserRole ? true : '')
                );
                if(userRole){
                  r.enabled = true
                }
              }
            });

        //bind Roles based on User Type
        if (this.isAdminUser == true) {
          orgRoles.forEach((element) => {
            this.roleDataList.push({
              roleId: element.roleId,
              roleKey: element.roleKey,
              accessRoleName: element.roleName,
              serviceName: element.serviceName,
            });
            this.formGroup.addControl(
              'orgRoleControl_' + element.roleId,
              this.formBuilder.control(this.assignedRoleDataList ? false : '')
            );
          });
          //Find assigned roles then enable checkbox as true
          user.detail.rolePermissionInfo &&
            user.detail.rolePermissionInfo.map((roleInfo) => {
              var orgRole = orgRoles.find((r) => r.roleId == roleInfo.roleId);
              if (orgRole) {
                this.assignedRoleDataList.push({
                  roleId: orgRole.roleId,
                });
              }
            });
        } else {
          user.detail.rolePermissionInfo &&
            user.detail.rolePermissionInfo.map((roleInfo) => {
              var orgRole = orgRoles.find((r) => r.roleId == roleInfo.roleId);
              if (orgRole) {
                switch (orgRole.roleKey) {
                  case 'CAT_USER': {
                    if (orgRole.roleName === 'Contract Award Service (CAS)') {
                      orgRole.roleName = 'Contract Award Service (CAS) - service';
                      orgRole.serviceName = 'Contract Award Service (CAS)';
                    }
                    break;
                  }
                  case 'ACCESS_CAAAC_CLIENT': {
                    if (orgRole.roleName === 'Contract Award Service (CAS)') {
                      orgRole.roleName = 'Contract Award Service (CAS) - dashboard';
                      orgRole.serviceName = 'Contract Award Service (CAS)';
                    }
                    break;
                  }
                  case 'JAEGGER_SUPPLIER': {
                    if (orgRole.roleName === 'eSourcing Service as a supplier') {
                      orgRole.roleName = 'eSourcing Service as a supplier';
                      orgRole.serviceName = 'eSourcing Service';
                    }
                    break;
                  }
                  case 'JAEGGER_BUYER': {
                    if (orgRole.roleName === 'eSourcing Service as a buyer') {
                      orgRole.roleName = 'eSourcing Service as a buyer';
                      orgRole.serviceName = 'eSourcing Service ';
                    }
                    break;
                  }
                  case 'JAGGAER_USER': {
                    if (orgRole.roleName === 'eSourcing Service') {
                      orgRole.roleName = 'eSourcing Service - service';
                      orgRole.serviceName = 'eSourcing Service';
                    }
                    break;
                  }
                  case 'ACCESS_JAGGAER': {
                    if (orgRole.roleName === 'eSourcing Service') {
                      orgRole.roleName = 'eSourcing Service - dashboard';
                      orgRole.serviceName = 'eSourcing Service';
                    }
                    break;
                  }
                  default: {
                    //statements;
                    break;
                  }
                }
                this.roleDataList.push({
                  accessRoleName: orgRole.roleName,
                  serviceName: orgRole.serviceName,
                });
              }
            });
        }
      });

    this.authService
      .hasPermission('MANAGE_GROUPS')
      .toPromise()
      .then((hasPermission: boolean) => {
        this.hasGroupViewPermission = hasPermission;
      });

    this.getUserContact(this.userName);
    this.onFormValueChange();

    if (this.isAdminUser == true) {
      this.detailsData = [
        'Add additional security steps to make your account more secure. Additional security needs to be enabled for all admin users. This can be accessed using a personal or work digital device.',
        'Here are the groups that you are a part of. Groups allow you to manage large numbers of users all at once. You can give your group a name, add users and assign them specifically required roles.',
        'The roles selected here will set what services are available to you.',
        'Send messages to multiple contacts in your organisation. You can also send targeted communications to specific users.',
      ];
    } else {
      this.detailsData = [
        'Add additional security steps to make your account more secure. Additional security needs to be enabled for all admin users. This can be accessed using a personal or work digital device.',
        'Here are the groups that you are a part of. Groups allow you to manage large numbers of users all at once. You can give your group a name, add users and assign them specifically required roles.',
        'The roles selected here will set what services are available to you. Contact your admin if something is wrong.',
        'Send messages to multiple contacts in your organisation. You can also send targeted communications to specific users.',
      ];
    }
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  scrollToAnchor(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  public checkIsPendingRole(role: Role) {
    let filterRole = this.pendingRoleDetails.find((element: { roleKey: any; }) => element.roleKey == role.roleKey)
    if (filterRole != undefined) {
      role.pendingStatus = true
      return true
    }
    return false
  }


  async getApprovalRequriedRoles() {
    this.approveRequiredRole = await this.orgGroupService
      .getOrganisationApprovalRequiredRoles()
      .toPromise();
  }

  async getOrgDetails() {
    this.organisationDetails = await this.organisationService.getOrganisation(this.organisationId).toPromise().catch(e => {
    });
  }

  async getPendingApprovalUserRole() {
    this.pendingRoleDetails = await this.userService.getPendingApprovalUserRole(this.userName).toPromise().catch(e => {
    });
    console.log("this.pendingRoleDetails", this.pendingRoleDetails)
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  getUserContact(userName: string) {
    this.userContactService.getUserContacts(userName).subscribe({
      next: (userContactsInfo: UserContactInfoList) => {
        if (userContactsInfo != null) {
          this.userContacts = this.contactHelper.getContactGridInfoList(
            userContactsInfo.contactPoints
          );
        }
      },
      error: (error: any) => { },
    });
  }

  onChangePasswordClick() {
    this.router.navigateByUrl('change-password');
  }

  onRequestRoleChangeClick() {
    console.log('RoleChange');
  }

  onContactEditRow(dataRow: ContactGridInfo) {
    let data = {
      isEdit: true,
      contactId: dataRow.contactId,
    };
    sessionStorage.setItem(
      SessionStorageKey.UserContactUsername,
      this.userName
    );
    this.router.navigateByUrl('user-contact-edit?data=' + JSON.stringify(data));
  }

  onContactAddClick() {
    let data = {
      isEdit: false,
      contactId: 0,
    };
    sessionStorage.setItem(
      SessionStorageKey.UserContactUsername,
      this.userName
    );
    this.router.navigateByUrl('user-contact-edit?data=' + JSON.stringify(data));
  }

  onContactAssignRemoveClick() {
    console.log('Assign');
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.formValid(form)) {
      this.submitted = false;
      let userRequest: UserProfileRequestInfo = {
        title: '',
        organisationId: this.organisationId,
        userName: this.userName,
        mfaEnabled: form.get('mfaEnabled')?.value,
        isAdminUser: this.isAdminUser,
        detail: {
          id: 0,
          roleIds: this.getSelectedRoleIds(form),
        },
        firstName: form.get('firstName')?.value,
        lastName: form.get('lastName')?.value,
      };
      this.userRequest = userRequest
      this.checkApproveRolesSelected()
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
    }
  }

  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelClick() {
    this.router.navigateByUrl('home');
  }

  onGroupViewClick(event: any) {
    var formData = {
      firstName: this.formGroup.get('firstName')?.value,
      lastName: this.formGroup.get('lastName')?.value,
    };

    let data = {
      isEdit: false,
      groupId: event.groupId,
      url: this.router.url,
      accessFrom:"users",
      isUserAccess:false
    };
    this.router.navigateByUrl(
      'manage-groups/view?data=' + JSON.stringify(data),
      { state: { formData: formData, routeUrl: this.router.url } }
    );
  }

  getSelectedRoleIds(form: FormGroup) {
    this.selectedRoleIds = [];
    this.selectedApproveRequiredRole = []
    const superAdminDomain = this.organisationDetails.detail.domainName.toLowerCase()
    const userDomain = this.userName?.split("@")[1].toLowerCase()
    this.roleDataList.map((role) => {
      if (form.get('orgRoleControl_' + role.roleId)?.value === true) {
        if (superAdminDomain != userDomain) {
          let filterRole = this.approveRequiredRole.find((element: { roleKey: any; }) => element.roleKey == role.roleKey)
          if (filterRole === undefined) {
            this.selectedRoleIds.push(role.roleId)
          } else {
            this.checkPendingRoleDetails(role)
          }
        } else {
          this.selectedRoleIds.push(role.roleId)
        }
      }
    });
    return this.selectedRoleIds;
  }

   private checkPendingRoleDetails(role:any){
    let filterAlreadyExistRole = this.pendingRoleDetails.find((element: { roleKey: any; }) => element.roleKey == role.roleKey)
    if (this.pendingRoleDetails.length == 0) {
      this.updateSelectedRoleIds(role)
    } else if(filterAlreadyExistRole.roleKey != role.roleKey) {
      this.selectedApproveRequiredRole.push(role.roleId)
    }
   }

   private updateSelectedRoleIds(role:any){
    if(role.enabled === true){
      this.selectedRoleIds.push(role.roleId)
    } else {
      this.selectedApproveRequiredRole.push(role.roleId)
    }
   }

  /**
     * checking approve required roles are availble
     */
  private checkApproveRolesSelected() {
    const superAdminDomain = this.organisationDetails.detail.domainName.toLowerCase()
    const userDomain = this.userName?.split("@")[1].toLowerCase()
    if (superAdminDomain != userDomain) {
      this.isInvalidDomain = true
      let matchRoles: any = []
      const selectedRole: any = this.selectedApproveRequiredRole
      this.roleDataList.forEach((allRole: Role) => {
        this.approveRequiredRole.forEach((aRole: Role) => {
          if (allRole.roleKey === aRole.roleKey) {
            selectedRole.forEach((sRole: number) => {
              if (allRole.roleId === sRole) {
                matchRoles.push(aRole)
              }
            })
          }
        })
      })
      localStorage.setItem('user_approved_role', JSON.stringify(matchRoles));

    }
    this.submitPendingApproveRole(superAdminDomain === userDomain);
  }


  private submitPendingApproveRole(isValidDomain:boolean): void {
    let selectedRolesDetails = {
      userName: this.userName,
      detail: {
        roleIds: this.selectedApproveRequiredRole
      }
    }
    if (this.selectedApproveRequiredRole.length != 0 && !isValidDomain) {
      this.userService.createPendingApproveRole(selectedRolesDetails).subscribe({
        next: (roleInfo: UserEditResponseInfo) => {
        this.checkDeleteStatusForPendingRole()
        },
        error: (err: any) => {
          console.log(err)
        },
      });
    } else {
       this.checkDeleteStatus()
    }
  }

  private checkDeleteStatusForPendingRole(){
      if (this.pendingRoledeleteDetails.length === 0) {
        this.updateUser()
      } else {
        this.deleteApprovePendingRole()
      }
    }

  private checkDeleteStatus(){
      if (this.pendingRoledeleteDetails.length != 0) {
        this.deleteApprovePendingRole()
      } else {
        this.updateUser()
      }
    }


  private updateUser(): void {
    this.userService.updateUser(this.userName, this.userRequest).subscribe(
      (data) => {
        this.authService.renewAccessToken();
        this.router.navigateByUrl(
          `operation-success/${OperationEnum.MyAccountUpdate}`
        );
      },
      (error) => {
        console.log(error);
        console.log(error.error);
      }
    );
  }
  onUserRoleChecked(obj: any, isChecked: boolean) {
    if (isChecked == true && obj.pendingStatus) {
        this.removePendingRole(obj)
    }
    if (isChecked == false && obj.pendingStatus) {
        let pendingRoledObj = this.pendingRoledeleteDetails.find((element: number) => element == obj.roleId)
        if (pendingRoledObj === undefined) {
          this.pendingRoledeleteDetails.push(obj.roleId)
        }
    }
  }
  
  private removePendingRole(obj:any){
    let pendingRole = this.pendingRoledeleteDetails.find((element: number) => element == obj.roleId)
        if (pendingRole != undefined) {
          this.pendingRoledeleteDetails.forEach((pRole: any, index: any) => {
            if (pRole === obj.roleId) {
              this.pendingRoledeleteDetails.splice(index, 1)
            }
          })
        }
 }

  private deleteApprovePendingRole(): void {
    const deleteRoleIds = this.pendingRoledeleteDetails.join();
    this.userService.deleteApprovePendingRole(this.userName, deleteRoleIds).subscribe({
      next: (userDeleteResponseInfo: UserEditResponseInfo) => {
        this.updateUser()
      },
      error: (err: any) => {
        console.log("err", err)
      },
    });
  }


  public customFocum(): void {
    if (
      this.formGroup.controls['firstName'].invalid &&
      this.formGroup.controls['lastName'].invalid
    ) {
      this.inputs.toArray()[0].nativeElement.focus();
    } else if (this.formGroup.controls['firstName'].invalid) {
      this.inputs.toArray()[0].nativeElement.focus();
    } else if (this.formGroup.controls['lastName'].invalid) {
      this.inputs.toArray()[1].nativeElement.focus();
    }
  }
  ResetAdditionalSecurity() {
    if (this.formGroup.controls.mfaEnabled.value) {
      let data = {
        data: this.userName,
        IsUser: false,
      }
      this.router.navigateByUrl('confirm-user-mfa-reset?data=' + btoa(JSON.stringify(data)))
    }
  }
}
