import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocationStrategy, ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserEditResponseInfo, UserGroup, UserProfileRequestInfo, userGroupTableDetail, userTypeDetails } from 'src/app/models/user';
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
import { Group, GroupList, Role } from 'src/app/models/organisationGroup';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuditLoggerService } from 'src/app/services/postgres/logger.service';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';
import { SessionStorageKey } from 'src/app/constants/constant';
import { environment } from 'src/environments/environment';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { SessionService } from 'src/app/shared/session.service';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile-component.html',
  styleUrls: ['./user-profile-component.scss'],
})
export class UserProfileComponent extends FormBaseComponent implements OnInit {
  public showRoleView: boolean = environment.appSetting.hideSimplifyRole
  public isFormGroupChanges: boolean = false
  submitted!: boolean;
  formGroup!: FormGroup;
  userServiceTableHeaders = ['NAME'];
  userRoleTableHeaders = ['ROLES', 'SERVICE'];
  userServiceGroupTableHeaders = ['NAME'];
  userServiceColumnsToDisplay = ['accessRoleName',]
  userServiceGroupColumnsToDisplay = [
    'name'
  ];
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
  public tabConfig = {
    userservices: true,
    groupservices: false
  }
  public detailsData: any = [];
  public isAdminUser: any;
  userGroups: UserGroup[] = [];
  public approveRequiredRole: Role[];
  public pendingRoleDetails: any = []
  public selectedApproveRequiredRole: any = []
  public pendingRoledeleteDetails: any = []
  public organisationDetails: any = {}
  private userRequest: any = {}
  isInvalidDomain: boolean = false
  userContacts: ContactGridInfo[] = [];
  userName: string;
  organisationId: string;
  buttonText: string | any;
  isEditContact: boolean = false;
  canChangePassword: boolean = false;
  identityProviderDisplayName: string = '';
  roleDataList: any[] = [];
  assignedRoleDataList: any[] = [];
  routeStateData: any = {};
  isOrgAdmin: boolean = false;
  private selectedRoleIds: number[] = [];
  public groupHint: string = ''
  private adminRoleKey: string = 'ORG_ADMINISTRATOR';
  private userRoleKey: string = 'ORG_DEFAULT_USER';
  public selectedGroupCheckboxes: any[] = [];
  public orgGroups: Group[] = [];
  public orgUserGroupRoles: any[] = [];
  public userTypeDetails: userTypeDetails = {
    title: 'User type',
    description: '',
    data: [],
    isGrayOut: null, // if want to gray out pass true otherwise null
    selectedValue: ""
  }
  public groupsMember: userGroupTableDetail = {
    isAdmin: false,
    headerText: "Groups I am a member of",
    headerTextKey: "groupName",
    accessTable: "groupsMember",
    noRoleText: "You do not have access to any service through membership of this group.",
    noDataGroupsMemberMessage: "You are not a member of any group.",
    groupShow: true,
    data: [],
  }
  public noneGroupsMember: userGroupTableDetail = {
    isAdmin: false,
    headerText: "Groups I am not a member of",
    headerTextKey: "groupName",
    accessTable: "noneGroupsMember",
    noRoleText: "This group is not assigned with access to any service.",
    noDatanoneGroupsMemberMessage: "There are no unassigned groups available for you.",
    groupShow: false,
    data: []
  }
  public isCustomMfaEnabled = environment.appSetting.customMfaEnabled;
  public isMfaEnabledForUser: boolean = false;
  public authenticationType: string = "";
  public orgMfaRequired: boolean = false;
  public ciiOrgId: string = "";
  public mfaOpted: boolean = false;
  public mfaRadioButtonValue : boolean = false;
  public isMfaRadioChange : boolean = false;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    private userService: WrapperUserService,
    private userContactService: WrapperUserContactService,
    private locationStrategy: LocationStrategy,
    protected uiStore: Store<UIState>,
    private formBuilder: FormBuilder,
    private router: Router,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private orgGroupService: WrapperOrganisationGroupService,
    private contactHelper: ContactHelper,
    private authService: AuthService,
    private auditLogService: AuditLoggerService,
    private organisationService: WrapperOrganisationService,
    private route: ActivatedRoute,
    private dataLayerService: DataLayerService,
    private tokenService: TokenService,
    private wrapperOrganisationService: WrapperOrganisationService,
    private sessionService:SessionService
  ) {
    super(
      viewportScroller,
      formBuilder.group({
        firstName: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z][a-z A-Z,.'-]*(?:\s+[a-zA-Z]+)?$")])],
        lastName: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z][a-z A-Z,.'-]*(?:\s+[a-zA-Z]+)?$")])],
        mfaEnabled: [null]
      })
    );
    this.userName = this.sessionService.decrypt('user_name')
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.routeStateData = this.router.getCurrentNavigation()?.extras.state;
    this.approveRequiredRole = []
    this.locationStrategy.onPopState(() => {
      this.onCancelClick();
    });
    this.orgGroups = [];
  }

  async ngOnInit() {
    if (this.isCustomMfaEnabled) {
      await this.GetOrganisationMfaSettings();
    }
    this.isAdminUser = this.route.snapshot.data.isAdmin;
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    localStorage.removeItem('UserContactUsername');
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
      this.isMfaEnabledForUser = user.mfaEnabled;
      this.mfaOpted = user.mfaOpted;
      if (this.isMfaEnabledForUser && this.isCustomMfaEnabled) {
        await this.authService.GetMfaAuthenticationType(this.userName).toPromise().then((data: any) => {
          if (data) {
            if (data.authMethod === "QRCODE") {
              this.authenticationType = "authentication app"
            }
            else if (data.authMethod === "SMS") {
              this.authenticationType = "text messages"
            }
          }
        }).catch((error) => {
          console.log('Error', error)
        });

      }
      if (!environment.appSetting.hideIDP) {
        this.identityProviderDisplayName =
          user.detail.identityProviders
            ?.map((idp) => idp.identityProviderDisplayName)
            .join(',') || '';
      } else {
        this.identityProviderDisplayName = 'User ID and password'
      }
      this.userGroups = user.detail.userGroups || [];

      if (this.routeStateData != undefined) {
        this.formGroup.setValue({
          firstName: this.routeStateData.firstName,
          lastName: this.routeStateData.lastName,
          mfaEnabled: user.mfaEnabled

        });
      } else {
        this.formGroup.setValue({
          firstName: user.firstName,
          lastName: user.lastName,
          mfaEnabled: user.mfaEnabled
        });
      } 
      this.pushDataLayer("form_start");
    }
    await this.getApprovalRequriedRoles()
    await this.getPendingApprovalUserRole();
    //await this.getOrgDetails();
    //await this.getOrgGroups();
    await this.orgGroupService
      .getOrganisationRoles(this.organisationId)
      .toPromise()
      .then((orgRoles: Role[]) => {
        orgRoles.map((r: Role, index) => {
          let userRole =
            user.detail.rolePermissionInfo &&
            user.detail.rolePermissionInfo.some(
              (rp) => rp.roleId == r.roleId
            );
          if (userRole) {
            this.formGroup.addControl(
              'orgRoleControl_' + r.roleId,
              this.formBuilder.control(this.assignedRoleDataList ? true : '')
            );
          } else {
            let PendinguserRole = this.pendingRoleDetails.some(
              (pendingRole: any) => pendingRole.roleKey == r.roleKey
            );
            this.formGroup.addControl(
              'orgRoleControl_' + r.roleId,
              this.formBuilder.control(userRole ? true : PendinguserRole ? true : '')
            );
            if (userRole) {
              r.enabled = true
            }
          }
        });

        orgRoles.forEach((role: any) => {
          if (role.roleKey === this.userRoleKey || role.roleKey === this.adminRoleKey) {
            this.userTypeDetails.data.push({
              id: role.roleId,
              key: role.roleKey,
              name: role.roleName,
              description: role.description
            });
          }
        })

        this.userTypeDetails.isGrayOut = true;
        this.userTypeDetails.selectedValue = this.isAdminUser ? this.adminRoleKey : this.userRoleKey;
        this.userTypeDetails.description = this.isAdminUser ? 'Only another administrator can change your user type.' : 'Only an administrator can change your user type.';

        //bind Roles based on User Type
        if (this.isAdminUser == true) {
          orgRoles.forEach((element: any) => {
            this.roleDataList.push({
              roleId: element.roleId,
              roleKey: element.roleKey,
              accessRoleName: element.roleName,
              serviceName: element.serviceName,
              description: element.description,
              displayOrder: element.displayOrder
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
          this.groupHint = "Select the services that you need access to."
        } else {
          user.detail.rolePermissionInfo &&
            user.detail.rolePermissionInfo.map((roleInfo) => {
              var orgRole: any = orgRoles.find((r) => r.roleId == roleInfo.roleId);
              if (orgRole && !this.isHideRole(orgRole.roleKey)) {
                switch (orgRole.roleKey) {
                  case 'CAT_USER': {
                    orgRole.serviceName = 'Contract Award Service (CAS)';
                    break;
                  }
                  case 'ACCESS_CAAAC_CLIENT': {
                    orgRole.serviceName = 'Contract Award Service (CAS)';
                    break;
                  }
                  case 'JAEGGER_SUPPLIER': {
                    orgRole.serviceName = 'eSourcing Service';
                    break;
                  }
                  case 'JAEGGER_BUYER': {
                    orgRole.serviceName = 'eSourcing Service';
                    break;
                  }
                  case 'JAGGAER_USER': {
                    orgRole.serviceName = 'eSourcing Service';
                    break;
                  }
                  case 'ACCESS_JAGGAER': {
                    orgRole.serviceName = 'eSourcing Service';
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
                  description: orgRole.description,
                  serviceView: !this.showRoleView,
                  approvalStatus: 1,
                  displayOrder: orgRole.displayOrder
                });
              }
            });

          //Adding the pending approval service to the user role list with label pending approval
          this.pendingRoleDetails && this.pendingRoleDetails.map((roleInfo: any) => {
            var orgRole: any = orgRoles.find((r) => r.roleId == roleInfo.roleId);
            if (orgRole) {
              this.roleDataList.push({
                accessRoleName: orgRole.roleName,
                serviceName: orgRole.serviceName,
                description: orgRole.description,
                serviceView: !this.showRoleView,
                approvalStatus: roleInfo.approvalStatus,
                displayOrder: orgRole.displayOrder
              });
            }
          });

          this.sortIndividualServices();
          this.groupHint = "These are the services that you have access to."
        }
      });

    await this.getOrgDetails();
    await this.getOrgGroups();


    this.getUserContact(this.userName);
    this.onFormValueChange();

    if (this.isAdminUser == true) {
      this.detailsData = [
        'Enable two-factor authentication to improve the security of your account. Additional security is required for administrator accounts.',
        'Here are the groups that you are a part of. Groups allow you to manage large numbers of users all at once. You can give your group a name, add users and assign them specifically required services.',
        'The roles selected here will set what services are available to you.',
        'Send messages to multiple contacts in your organisation. You can also send targeted communications to specific users.',
      ];
    } else {
      this.detailsData = [
        'Two-factor authentication improves the security of your account. Only administrators can enable or disable additional security for users.',
        'Here are the groups that you are a part of. Groups allow you to manage large numbers of users all at once. You can give your group a name, add users and assign them specifically required services.',
        'The roles selected here will set what services are available to you. Contact your admin if something is wrong.',
        'Send messages to multiple contacts in your organisation. You can also send targeted communications to specific users.',
      ];
    }
    this.removeDefaultUserRoleFromServiceRole();
    this.setAccordinoForUser()
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: this.sessionService.decrypt('user_name'),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
     });
    })
  }

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "My Profile"
    });
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }



  scrollToAnchor(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  private setAccordinoForUser() {
    if (!this.isAdminUser) {
      this.groupsMember.noRoleText = "You do not have access to any service through membership of this group."
    }
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
    if (this.isAdminUser) {
      this.organisationDetails = await this.organisationService.getOrganisation(this.organisationId).toPromise().catch(e => {
      });
    }
  }

  async getPendingApprovalUserRole() {
    this.pendingRoleDetails = await this.userService.getPendingApprovalUserRole(this.userName).toPromise().catch(e => {
    });
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
          this.userContacts.forEach((f)=>{
            let data = {
              'isEdit': true,
              'contactId': f.contactId,
            };
          this.sessionService.encrypt('UserContactUsername',this.userName);
          let queryParams = {data: JSON.stringify(data)}
          f.routeLink= `/user-contact-edit`
          f.routeData = queryParams
          })
        }
        if (userContactsInfo.contactPoints && userContactsInfo.contactPoints.length > 0) {
          this.buttonText = 'ADD_ANOTHER_CONTACT_BTN';
          this.isEditContact = false;
        } else {
          this.buttonText = 'ADD_CONTACT';
          this.isEditContact = true;
        }
      },
      error: (error: any) => { },
    });
  }

  onChangePasswordClick() {
    this.router.navigateByUrl('change-password');
    this.pushDataLayerEvent();
  }

  onRequestRoleChangeClick() {
    console.log('RoleChange');
  }

  onContactEditRow(dataRow: ContactGridInfo) {
    let data = {
      isEdit: true,
      contactId: dataRow.contactId,
    };
    this.sessionService.encrypt(SessionStorageKey.UserContactUsername,this.userName)
    this.router.navigateByUrl('user-contact-edit?data=' + JSON.stringify(data));
  }

  onContactAddClick() {
    let data = {
      isEdit: false,
      contactId: 0,
      isEditContact: this.isEditContact,
    };
    sessionStorage.setItem(
      SessionStorageKey.UserContactUsername,
      this.userName
    );
    this.sessionService.encrypt('UserContactUsername',this.userName);
    this.router.navigateByUrl('user-contact-edit?data=' + JSON.stringify(data));
    this.pushDataLayerEvent();
  }

  onContactAssignRemoveClick() {
    console.log('Assign');
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.formValid(form)) {
      this.pushDataLayer("form_submit");
      this.submitted = false;
      let userRequest: UserProfileRequestInfo = {
        title: '',
        organisationId: this.organisationId,
        userName: this.userName,
        mfaOpted: this.mfaOpted,
        mfaEnabled: form.get('mfaEnabled')?.value,
        isAdminUser: this.isAdminUser,
        detail: {
          id: 0,
          roleIds: this.getSelectedRoleIds(form),
          groupIds: this.selectedGroupCheckboxes
        },
        firstName: form.get('firstName')?.value,
        lastName: form.get('lastName')?.value,
        isDormant:false
      };

      this.userRequest = userRequest
      if (this.isCustomMfaEnabled) {
        this.mfaRadioButtonValue = form.get('mfaEnabled')?.value;

        if (!this.isMfaEnabledForUser && this.mfaRadioButtonValue) {
          this.userRequest.mfaEnabled = false;
          this.userRequest.mfaOpted = false;
        }
        if (this.isMfaEnabledForUser && !this. mfaRadioButtonValue) {
          this.userRequest.mfaEnabled = false;
          this.userRequest.mfaOpted = true;
        }

      }


      this.checkApproveRolesSelected()
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
      this.pushDataLayer("form_error");
    }
  }

  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelClick() {
    this.router.navigateByUrl('home');
    this.pushDataLayerEvent();
  }



  getSelectedRoleIds(form: FormGroup) {
    if (this.organisationDetails.detail == undefined) {
      return
    }
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
    // Remove below line to seperate normal and approval required role. It is added as we will not be using seperate api. Only user update api will be used.
    this.selectedRoleIds.push(...this.selectedApproveRequiredRole);
    return this.selectedRoleIds;
  }

  private checkPendingRoleDetails(role: any) {
    let filterAlreadyExistRole = this.pendingRoleDetails.find((element: { roleKey: any; }) => element.roleKey == role.roleKey)
    if (this.pendingRoleDetails.length == 0) {
      this.updateSelectedRoleIds(role)
    } else if (filterAlreadyExistRole?.roleKey != role.roleKey) {
      this.selectedApproveRequiredRole.push(role.roleId)
    }
    // Remove below line to seperate normal and approval required role. It is added as we will not be using seperate api. Only user update api will be used
    else if (filterAlreadyExistRole?.roleKey == role.roleKey) {
      this.selectedRoleIds.push(role.roleId)
    }
  }

  private updateSelectedRoleIds(role: any) {
    if (role.enabled === true) {
      this.selectedRoleIds.push(role.roleId)
    } else {
      this.selectedApproveRequiredRole.push(role.roleId)
    }
  }

  /**
     * checking approve required roles are availble
     */
  private checkApproveRolesSelected() {
    if (this.organisationDetails.detail == undefined) {
      this.updateUser()
      return
    }
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
      localStorage.setItem('user_access_name', this.userName);
    }
    this.submitPendingApproveRole(superAdminDomain === userDomain);
  }


  private submitPendingApproveRole(isValidDomain: boolean): void {
    let selectedRolesDetails = {
      userName: this.userName,
      organisationId: this.organisationDetails.detail.organisationId,
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

  private checkDeleteStatusForPendingRole() {
    if (this.pendingRoledeleteDetails.length === 0) {
      this.updateUser()
    } else {
      this.deleteApprovePendingRole()
    }
  }

  private checkDeleteStatus() {
    if (this.pendingRoledeleteDetails.length != 0) {
      this.deleteApprovePendingRole()
    } else {
      this.updateUser()
    }
  }


  private updateUser(): void {
    this.userService.updateUser(this.userName, this.userRequest).subscribe(
      (data) => {
        if(this.isCustomMfaEnabled && !this.isMfaEnabledForUser && this.mfaRadioButtonValue &&this.isMfaRadioChange)
        {
          // To skip renewAccessToken
        } 
        else
        {
           this.authService.renewAccessToken();
        }
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

  // Removed below logic to avoid approval required seperate delete api call. Delete pending role will be handled in normal role put call.
  onUserRoleChecked(obj: any, isChecked: boolean) {
    // if (isChecked == true && obj.pendingStatus) {
    //     this.removePendingRole(obj)
    // }
    // if (isChecked == false && obj.pendingStatus) {
    //     let pendingRoledObj = this.pendingRoledeleteDetails.find((element: number) => element == obj.roleId)
    //     if (pendingRoledObj === undefined) {
    //       this.pendingRoledeleteDetails.push(obj.roleId)
    //     }
    // }
  }

  private removePendingRole(obj: any) {
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


  public focusUserProfileInput(): void {
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
    this.pushDataLayerEvent();
  }

  async getOrgGroups() {
    const orgGrpList = await this.orgGroupService.getOrganisationGroupsWithRoles(this.organisationId).toPromise<GroupList>();
    this.orgGroups = orgGrpList.groupList;
    this.groupsMember.isAdmin = this.isAdminUser;
    this.noneGroupsMember.isAdmin = this.isAdminUser;
    this.getGroupDetails()
  }


  private getGroupDetails() {
    for (const group of this.orgGroups) {
      const isGroupOfUser: any = this.userGroups?.find((ug) => ug.groupId === group.groupId);
      this.matchGroupIds(isGroupOfUser, group)
    }
  }

  private matchGroupIds(isGroupOfUser: any, group: any) {
    group.disabled = (group.groupType === 1) ? true : null;
    if (isGroupOfUser) {
      this.setPendingApproveForGroup(group)
      group.checked = true
      group.serviceRoleGroups = group.serviceRoleGroups.filter((data: any) => data.approvalStatus === 0 || data.approvalStatus === 1);
      this.groupsMember.data.push(group)
      this.selectedGroupCheckboxes.push(group.groupId)
      this.setPendingApprovalStatus(group)
    } else {
      if (this.isAdminUser) {
        this.noneGroupsMember.data.push(group)
      }
    }
  }


  private setPendingApproveForGroup(group: any) {
    group.serviceRoleGroups.map((fc: any) => {
      var serviceGroupApprovalDetails: any = this.userGroups?.find((ug: any) => ug.groupId === group.groupId && ug.accessServiceRoleGroupId === fc.id);
      fc.approvalStatus = serviceGroupApprovalDetails?.approvalStatus;
    });
  }


  private setPendingApprovalStatus(group: any) {
    for (const element of group.serviceRoleGroups) {
      const hasMatchingRole = this.orgUserGroupRoles.some(role => role.id === element.id);
      if (!hasMatchingRole && (element.approvalStatus === 0 || element.approvalStatus === 1)) {
        element.serviceView = true;
        if (element.name != "Organisation Administrator") {
          this.orgUserGroupRoles.push(element);
        }
      }
    }
    this.setGroupAdmin()
  }

  private setGroupAdmin() {
    if (this.orgUserGroupRoles.length > 0) {
      this.sortGroupDisplayOrder()
    }
  }

  private sortGroupDisplayOrder() {
    this.orgUserGroupRoles = this.orgUserGroupRoles.sort(function (c, d) { return c.displayOrder - d.displayOrder });
  }


  public groupsMemberCheckBoxAddRoles(data: any) {
    this.selectedGroupCheckboxes.push(data.groupId);
    this.IsChangeInGroupAdminSelection(this.userGroups?.map(x => x.groupId));
  }

  public groupsMemberCheckBoxRemoveRoles(data: any) {
    this.selectedGroupCheckboxes = this.removeObjectById(this.selectedGroupCheckboxes, data.groupId)
    this.IsChangeInGroupAdminSelection(this.userGroups?.map(x => x.groupId));
  }

  public noneGroupsMemberCheckBoxAddRoles(data: any) {
    this.selectedGroupCheckboxes.push(data.groupId);
    this.IsChangeInGroupAdminSelection(this.userGroups?.map(x => x.groupId));
  }

  public noneGroupsMemberCheckBoxRemoveRoles(data: any) {
    this.selectedGroupCheckboxes = this.removeObjectById(this.selectedGroupCheckboxes, data.groupId)
    this.IsChangeInGroupAdminSelection(this.userGroups?.map(x => x.groupId));
  }

  private removeObjectById(arr: any, id: any) {
    return arr.filter((item: any) => item !== id);
  }

  public getDisbleRole(orgRole: any) {
    if (orgRole === this.userRoleKey || orgRole === this.adminRoleKey) {
      return true
    } else {
      return null
    }
  }

  public isHideRole(orgRole: any) {
    if (orgRole === this.userRoleKey || orgRole === this.adminRoleKey) {
      return true
    } else {
      return false
    }
  }

  public tabChanged(activetab: string): void {
    document.getElementById(activetab)?.scrollIntoView({
      block: 'start',
      inline: 'nearest',
    });
    if (activetab === 'user-service') {
      this.tabConfig.userservices = true
      this.tabConfig.groupservices = false
    } else {
      this.tabConfig.groupservices = true
      this.tabConfig.userservices = false
    }

    this.dataLayerService.pushEvent({
      event: "tab_navigation",
      link_text: activetab === 'user-service' ? "Individual access": "Group access"
    })
  }

  public IsChangeInGroupAdminSelection(responseGroups: any): void {
    var isSelectedAndResponseGroupsSame = !this.selectedGroupCheckboxes.every((groupId: any) => responseGroups.includes(groupId));
    var isResponseGroupsSame = !responseGroups.every((groupId: any) => this.selectedGroupCheckboxes.includes(groupId));
    if (isSelectedAndResponseGroupsSame || isResponseGroupsSame) {
      this.isFormGroupChanges = true;
    }
    else {
      this.isFormGroupChanges = false;
    }
  }

  public get isFormChanges() {
    return this.formChanged || this.isFormGroupChanges;
  }

  private sortIndividualServices() {
    if (this.roleDataList.length > 0) {
      this.roleDataList = this.roleDataList.sort(function (c, d) {
        return c.displayOrder - d.displayOrder
      });
    }
  }

  public onUserTypeChanged(event: any) {
    console.log("disable event")
  }

  private removeDefaultUserRoleFromServiceRole() {
    let defaultUserRoleId = this.userTypeDetails.data.filter(x => x.key === 'ORG_DEFAULT_USER')[0].id;
    this.groupsMember.data.forEach(grp => {
      grp.serviceRoleGroups = grp.serviceRoleGroups.filter((item: any) => item.id !== defaultUserRoleId);
    });
    this.noneGroupsMember.data.forEach(grp => {
      grp.serviceRoleGroups = grp.serviceRoleGroups.filter((item: any) => item.id !== defaultUserRoleId);
    });
    this.orgUserGroupRoles = this.orgUserGroupRoles.filter((item: any) => item.id !== defaultUserRoleId);
  }

  public scrollContent(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      block: 'start',
      inline: 'nearest',
    });
  }


  pushDataLayer(event:string){
    this.dataLayerService.pushEvent({
      'event': event,
      'form_id': 'Manage_my_account'
    });
  }

  public async GetOrganisationMfaSettings() {
    this.ciiOrgId = this.tokenService.getCiiOrgId();
    await this.wrapperOrganisationService.getOrganisationMfaStatus(this.ciiOrgId).toPromise().then((data: any) => {
      this.orgMfaRequired = data.toLowerCase() === 'true';
    })
      .catch((err) => {
        console.log('error', err);
      });

  }
  onResetMfaClick() {
    if (this.formGroup.controls.mfaEnabled.value) {
      let data = {
        data: this.userName,
        IsUser: false,
      }
      this.router.navigateByUrl('confirm-user-mfa-reset?data=' + btoa(JSON.stringify(data)))
    }

  }
  onRadioChange(form: FormGroup)
  {
    this.isMfaRadioChange = false;
    this.mfaRadioButtonValue = form.get('mfaEnabled')?.value;
    if (this.isMfaEnabledForUser !=this.mfaRadioButtonValue )
    {
      this.isMfaRadioChange  = true;
    }
  }
}
