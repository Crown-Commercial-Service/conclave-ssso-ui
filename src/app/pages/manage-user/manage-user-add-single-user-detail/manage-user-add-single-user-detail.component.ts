import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocationStrategy, ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum, UserTitleEnum } from 'src/app/constants/enum';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UserEditResponseInfo,UserProfileRequestInfo,UserProfileResponseInfo,userGroupTableDetail,userTypeDetails} from 'src/app/models/user';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { Group, GroupList, Role } from 'src/app/models/organisationGroup';
import { IdentityProvider } from 'src/app/models/identityProvider';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';
import { SessionStorageKey } from 'src/app/constants/constant';
import { PatternService } from 'src/app/shared/pattern.service';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { environment } from 'src/environments/environment';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-user-add-single-user-detail',
  templateUrl: './manage-user-add-single-user-detail.component.html',
  styleUrls: ['./manage-user-add-single-user-detail.component.scss'],
})
export class ManageUserAddSingleUserDetailComponent
  extends FormBaseComponent
  implements OnInit, OnDestroy {
  public organisationId: string;
  public userProfileRequestInfo: UserProfileRequestInfo;
  public userProfileResponseInfo: UserProfileResponseInfo;
  public submitted!: boolean;
  public orgGroups: Group[];
  public orgRoles: any[];
  public identityProviders: IdentityProvider[];
  public allIdps: IdentityProvider[];
  public isEdit: boolean = false;
  public isAutoDisableMFA: boolean = false;
  public editingUserName: string = '';
  public userTitleEnum = UserTitleEnum;
  public errorLinkClicked: boolean = false;
  public routeData: any = {};
  public state: any;
  public hasGroupViewPermission: boolean = false;
  public mfaAdminValidationError: boolean = false;
  public idpStatus = environment.appSetting.hideIDP
  public approveRequiredRole: Role[];
  public organisationDetails: any = {}
  public pendingRoleDetails: any = []
  public selectedApproveRequiredRole: any = []
  public pendingRoledeleteDetails: any = []
  public selectedGroupCheckboxes: any[] = [];
  public orgUserGroupRoles: any[] = [];
  public userTypeDetails:userTypeDetails = {
    title:'User type',
    description:'',
    data: [],
    isGrayOut:null, // if want to gray out pass true otherwise null
    selectedValue:""
  }
  public groupsMember: userGroupTableDetail = {
    isAdmin: true,
    headerText: "Groups this user is a member of",
    headerTextKey: "groupName",
    accessTable: "groupsMember",
    noRoleText:"This user does not have access to any service through their membership of this group.",
    groupShow: true,
    data: [],
  }
  public noneGroupsMember: userGroupTableDetail = {
    isAdmin: true,
    headerText: "Groups this user is not a member of",
    headerTextKey: "groupName",
    accessTable: "noneGroupsMember",
    noRoleText: "This group is not assigned with access to any service.",
    groupShow: false,
    data: []
  }
  public detailsData: any = [
    'Enable two-factor authentication to improve the security of your account. Additional security is required for administrator accounts.',
    'Groups allow you to manage large numbers of users all at once. Services can be applied to groups to organise user’s more efficiently and allow bulk access to relevant services where it is required.',
    'The roles selected here will set what services are available to your users.',
  ];
  public tabConfig = {
    userservices: true,
    groupservices: false
  }
  public userTitleArray = ['Mr', 'Mrs', 'Miss', 'Ms', 'Doctor', 'Unspecified'];
  public emailHaserror: boolean = false;
  public MFA_Enabled: any = false;
  public ciiOrganisationId: string;
  private selectedRoleIds: number[] = []
  public isInvalidDomain: boolean = false
  public subscription: Subscription = new Subscription;
  public showRoleView: boolean = environment.appSetting.hideSimplifyRole
  public isFormGroupChanges:boolean = false
  public isFormUserTypeChanges:boolean = false
  public selectedUserType: any;
  public oldSelectedUserType: any;
  public isAdminUser: boolean = false;

  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  constructor(
    private organisationGroupService: WrapperOrganisationGroupService,
    private configWrapperService: WrapperConfigurationService,
    private PatternService: PatternService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected uiStore: Store<UIState>,
    private titleService: Title,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private wrapperUserService: WrapperUserService,
    private authService: AuthService,
    private locationStrategy: LocationStrategy,
    private organisationService: WrapperOrganisationService,
    private sharedDataService: SharedDataService
  ) {
    super(
      viewportScroller,
      formBuilder.group({
        userTitle: [null],
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-z A-Z,.'-]*(?:s+[a-zA-Z]+)?$"),
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-z A-Z,.'-]*(?:s+[a-zA-Z]+)?$"),
          ]),
        ],
        mfaEnabled: [false],
        userName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ]),
        ],
      })
    );
    let queryParams = this.activatedRoute.snapshot.queryParams;
    this.state = this.router.getCurrentNavigation()?.extras.state;
    this.ciiOrganisationId = localStorage.getItem('cii_organisation_id') || '';
    localStorage.removeItem('user_approved_role');
    localStorage.removeItem('user_access_name');
    if (queryParams.data) {
      this.subscription = this.sharedDataService.userEditDetails.subscribe((data) => {
        this.routeData = JSON.parse(atob(queryParams.data));
        this.isEdit = this.routeData['isEdit'];
        this.editingUserName = sessionStorage.getItem(SessionStorageKey.ManageUserUserName) ?? '';
        this.editingUserName = data.rowData;
      })
    }
    this.orgGroups = [];
    this.orgRoles = [];
    this.identityProviders = [];
    this.allIdps = [];
    this.approveRequiredRole = []
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.orgUserGroupRoles = [];
    this.userProfileRequestInfo = {
      organisationId: this.organisationId,
      title: 'undefined',
      userName: '',
      mfaEnabled: false,
      mfaOpted:false,
      isAdminUser: false,
      detail: {
        id: 0,
        groupIds: [],
        roleIds: [],
      },
      firstName: '',
      lastName: '',
    };
    this.userProfileResponseInfo = {
      userName: '',
      mfaEnabled: false,
      mfaOpted:false,
      isAdminUser: false,
      detail: {
        id: 0,
        canChangePassword: false,
      },
      organisationId: this.organisationId,
      title: '',
      firstName: '',
      lastName: '',
    };
  }

  async ngOnInit() {
    this.titleService.setTitle(
      `${this.isEdit ? 'Edit' : 'Add'} - Manage Users - CCS`
    );
    this.authService.hasPermission('MANAGE_GROUPS').subscribe({
      next: (hasPermission: boolean) => {
        this.hasGroupViewPermission = hasPermission;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
    if (this.isEdit) {
      let userProfileResponseInfo = await this.wrapperUserService
        .getUser(this.editingUserName)
        .toPromise();
      if (this.state) {
        this.userProfileResponseInfo = this.state;
      } else {
        this.userProfileResponseInfo = userProfileResponseInfo;
      }
      this.formGroup.controls['userTitle'].setValue(
        this.userProfileResponseInfo.title
      );
      this.formGroup.controls['firstName'].setValue(
        this.userProfileResponseInfo.firstName
      );
      this.formGroup.controls['lastName'].setValue(
        this.userProfileResponseInfo.lastName
      );
      this.formGroup.controls['userName'].setValue(
        this.userProfileResponseInfo.userName
      );
      this.formGroup.controls['mfaEnabled'].setValue(
        this.userProfileResponseInfo.mfaEnabled
      );
      await this.getApprovalRequriedRoles()
      await this.getPendingApprovalUserRole();
      await this.getOrgDetails()
      await this.getOrgGroupsForUser();
      await this.getOrgRoles();
      await this.getIdentityProviders();
      this.onFormValueChange();
    } else {
      if (this.state) {
        this.userProfileResponseInfo = this.state;
        this.formGroup.controls['userTitle'].setValue(
          this.userProfileResponseInfo.title
        );
        this.formGroup.controls['firstName'].setValue(
          this.userProfileResponseInfo.firstName
        );
        this.formGroup.controls['lastName'].setValue(
          this.userProfileResponseInfo.lastName
        );
        this.formGroup.controls['userName'].setValue(
          this.userProfileResponseInfo.userName
        );
        this.formGroup.controls['mfaEnabled'].setValue(
          this.userProfileResponseInfo.mfaEnabled
        );
      }
      await this.getApprovalRequriedRoles()
      await this.getOrgDetails()
      await this.getOrgGroupsForUser();
      await this.getOrgRoles();
      await this.getIdentityProviders();
      this.onFormValueChange();
      this.patchAdminMailData()
    }
    this.MFA_Enabled = this.formGroup.controls.mfaEnabled.value;
    this.setAccordionDetails()
    this.orgRoles.forEach((role: any) => {
      if (role.roleKey === 'ORG_DEFAULT_USER' || role.roleKey === 'ORG_ADMINISTRATOR') {
        this.userTypeDetails.data.push({
            id: role.roleId,
            key: role.roleKey,
            name: role.roleName,
            description: role.description
        });
      }
    });
    this.userTypeDetails.selectedValue = this.isAdminUser ? 'ORG_ADMINISTRATOR' : 'ORG_DEFAULT_USER';
    this.oldSelectedUserType = this.isAdminUser ? 'ORG_ADMINISTRATOR' : 'ORG_DEFAULT_USER';
    this.removeDefaultUserRoleFromServiceRole();
  }

  private patchAdminMailData() {
    if (this.routeData.isCreatedByAdmin === true) {
      this.formGroup.controls['firstName'].setValue(
        this.routeData.firstName
      );
      this.formGroup.controls['lastName'].setValue(
        this.routeData.lastName
      );
      this.formGroup.controls['userName'].setValue(
        this.routeData.userName
      );
    }
  }

  private setAccordionDetails(){
    if(!this.isEdit){
      this.noneGroupsMember.headerText = "Available groups"
      this.noneGroupsMember.noRoleText = "This group is not assigned with access to any service."
    }
  }
  
  async getIdentityProviders() {
    let masterIdps = await this.configWrapperService.getIdentityProviders().toPromise().catch();
    this.identityProviders = await this.organisationGroupService.getOrganisationIdentityProviders(this.organisationId).toPromise();
    for (const idp of masterIdps) {
      if (idp.connectionName === 'none') continue;

      let anyOrganisationIdp = this.identityProviders.find((x: any) => x.connectionName === idp.connectionName);
      if (anyOrganisationIdp) {
        idp.id = anyOrganisationIdp.id;
        if (this.isEdit) {
          let havingIdp: boolean | any = true;
          havingIdp = this.userProfileResponseInfo.detail.identityProviders?.some((userIdp) => userIdp.identityProviderId == idp.id);
          this.formGroup.addControl('signInProviderControl_' + idp.id, this.formBuilder.control(havingIdp ? true : ''));
        } else {
          this.formGroup.addControl('signInProviderControl_' + idp.id, this.formBuilder.control(true));
        }
        this.allIdps.push(idp);
      } else {
        this.formGroup.addControl('signInProviderControl_' + idp.id, this.formBuilder.control(false));

        this.allIdps.push(idp);
      }
    }

  }

  async getIdentityProviders_1() {
    this.identityProviders = await this.organisationGroupService
      .getOrganisationIdentityProviders(this.organisationId)
      .toPromise();
    this.identityProviders.forEach((idp) => {
      let havingIdp =
        this.userProfileResponseInfo.detail.identityProviders?.some(
          (userIdp) => userIdp.identityProviderId == idp.id
        );
      this.formGroup.addControl(
        'signInProviderControl_' + idp.id,
        this.formBuilder.control(havingIdp ? true : '')
      );
    });
  }


  async getOrgGroupsForUser() {
    const orgGrpList = await this.organisationGroupService.getOrganisationGroupsWithRoles(this.organisationId).toPromise<GroupList>();
    this.orgGroups = orgGrpList.groupList;
    this.getAllGroupDetails()
  }

private getAllGroupDetails(){
  for (const group of this.orgGroups) {
    const isGroupOfUser: any = this.userProfileResponseInfo?.detail?.userGroups?.find((ug) => ug.groupId === group.groupId);
    this.GetAssignedGroups(isGroupOfUser,group)
  }
}

private GetAssignedGroups(isGroupOfUser:any,group:any){
  if (isGroupOfUser) {
    group.serviceRoleGroups.map((fc: any) => {
      var serviceGroupApprovalDetails: any = this.userProfileResponseInfo?.detail?.userGroups?.find((ug: any) => ug.groupId === group.groupId && ug.accessServiceRoleGroupId === fc.id);
      fc.approvalStatus = serviceGroupApprovalDetails?.approvalStatus;
    });
    group.checked = true
    group.serviceRoleGroups = group.serviceRoleGroups.filter((item: any) => item.approvalStatus === 0 || item.approvalStatus === 1);
    this.groupsMember.data.push(group)
    this.selectedGroupCheckboxes.push(group.groupId)
    this.setOrgUserRole(group)
  } else {
    this.noneGroupsMember.data.push(group)
  }
  this.setDisplayOrder()
 }


 private setOrgUserRole(group:any){
  group.serviceRoleGroups.forEach((element: any) => {
    let groupRoles = this.orgUserGroupRoles.filter(e => { return e.id == element.id });
    if (groupRoles.length <= 0 && (element.approvalStatus == 0 || element.approvalStatus == 1)) {
      if(element.name != "Organisation Administrator"){
        this.orgUserGroupRoles.push(element);
      }
    }
  });
 }

 private setDisplayOrder(){
  if(this.orgUserGroupRoles.length > 0){
    this.orgUserGroupRoles = this.orgUserGroupRoles.sort(function(a,b){ return a.displayOrder - b.displayOrder});
  } 
 }

  async getOrgRoles() {
    this.orgRoles = await this.organisationGroupService
      .getOrganisationRoles(this.organisationId)
      .toPromise();
    this.orgRoles.map((role) => {
      let userRole =
        this.userProfileResponseInfo.detail.rolePermissionInfo &&
        this.userProfileResponseInfo.detail.rolePermissionInfo.some(
          (rp) => rp.roleId == role.roleId
        );
      if (!this.isEdit) {
        if (role.roleKey !== 'ORG_DEFAULT_USER' && role.roleKey !== 'ORG_ADMINISTRATOR') {
          this.formGroup.addControl(
            'orgRoleControl_' + role.roleId,
            this.formBuilder.control(userRole ? true : '')
          );
        }
      } else {
        let PendinguserRole = this.pendingRoleDetails.some(
          (pendingRole: any) => pendingRole.roleKey == role.roleKey
        );
        if (role.roleKey !== 'ORG_DEFAULT_USER' && role.roleKey !== 'ORG_ADMINISTRATOR') {
          this.formGroup.addControl(
            'orgRoleControl_' + role.roleId,
            this.formBuilder.control(userRole ? true : PendinguserRole ? true : '')
          );
        }
        if (userRole == true) {
          role.enabled = true
        }
        let filterRole = this.pendingRoleDetails.find((element: { roleKey: any; }) => element.roleKey == role.roleKey)
        if (filterRole != undefined) {
          role.pendingStatus = true
        }
      }
      //Edit mode Determin Login user whether Admin/Normal user.
      if (
        role.roleKey == 'ORG_ADMINISTRATOR' &&
        userRole == true &&
        this.isAutoDisableMFA == false
      ) {
        this.isAutoDisableMFA = true;
        this.isAdminUser = true;
          this.selectedUserType = {
            id: role.roleId,
            key: role.roleKey
          };
      }

    });

    if(!this.selectedUserType){
      var role = this.orgRoles.filter(x => x.roleKey == 'ORG_DEFAULT_USER');
          this.selectedUserType = {
            id: role[0].roleId,
            key: role[0].roleKey
          };
    }
  }

  async getApprovalRequriedRoles() {
    this.approveRequiredRole = await this.organisationGroupService
      .getOrganisationApprovalRequiredRoles()
      .toPromise();
  }

  async getOrgDetails() {
    this.organisationDetails = await this.organisationService.getOrganisation(this.ciiOrganisationId).toPromise().catch(e => {
    });
  }

  async getPendingApprovalUserRole() {
    this.pendingRoleDetails = await this.wrapperUserService.getPendingApprovalUserRole(this.userProfileResponseInfo.userName).toPromise().catch(e => {
    });
  }


  scrollToAnchor(elementId: string): void {
    this.errorLinkClicked = true; // Making the errorLinkClicked true to avoid scrolling to the error-summary
    this.viewportScroller.scrollToAnchor(elementId);
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  validateEmailLength(data: any) {
    this.emailHaserror = false;
    if (this.PatternService.emailValidator(data.target.value)) {
      this.formGroup.controls['userName'].setErrors({ incorrect: true });
    }
  }

  public onSubmit(form: FormGroup) {
    this.emailHaserror = false;
    this.mfaAdminValidationError = false;
    this.submitted = true;

    if (this.PatternService.emailValidator(form.get('userName')?.value)) {
      this.formGroup.controls['userName'].setErrors({ incorrect: true });
    }
    if (this.formValid(form)) {
      this.userProfileRequestInfo.title = form.get('userTitle')?.value;
      this.userProfileRequestInfo.firstName = form.get('firstName')?.value;
      this.userProfileRequestInfo.lastName = form.get('lastName')?.value;
      this.userProfileRequestInfo.userName = form.get('userName')?.value;
      this.userProfileRequestInfo.mfaEnabled = form.get('mfaEnabled')?.value;
      this.userProfileRequestInfo.detail.identityProviderIds =
        this.getSelectedIdpIds(form);
      // this.userProfileRequestInfo.detail.groupIds =
      //   this.getSelectedGroupIds(form);
      this.userProfileRequestInfo.detail.roleIds =
        this.getSelectedRoleIds(form);
      this.checkApproveRolesSelected()
      if (this.isEdit) {
        this.saveChanges("update", form)
      } else {
        this.saveChanges("create", form)
      }
    } else {
      this.scrollView();
    }
  }



  private scrollView(): void {
    setTimeout(() => {
      const element = document.getElementById('error-summary');
      element?.scrollIntoView();
    }, 10);
  }

  getSelectedIdpIds(form: FormGroup) {
    let selectedIdpIds: number[] = [];
    this.identityProviders.map((group) => {
      if (form.get('signInProviderControl_' + group.id)?.value === true) {
        selectedIdpIds.push(group.id);
      }
    });
    return selectedIdpIds;
  }

  // getSelectedGroupIds(form: FormGroup) {
  //   let selectedGroupIds: number[] = [];
  //   this.orgGroups.map((group) => {
  //     if (form.get('orgGroupControl_' + group.groupId)?.value === true) {
  //       selectedGroupIds.push(group.groupId);
  //     }
  //   });
  //   return selectedGroupIds;
  // }



  getSelectedRoleIds(form: FormGroup) {
    this.selectedRoleIds = []
    this.selectedApproveRequiredRole = []
    const superAdminDomain = this.organisationDetails.detail.domainName.toLowerCase()
    const userDomain = this.formGroup.get('userName')?.value.split("@")[1].toLowerCase()
    this.orgRoles.map((role) => {
      if (form.get('orgRoleControl_' + role.roleId)?.value === true) {
        if (superAdminDomain != userDomain) {
          this.invalidDomainConfig(role)
        } else {
          this.selectedRoleIds.push(role.roleId)
        }
      }
    });
    // Remove below line to seperate normal and approval required role. It is added as we will not be using seperate api. Only user update api will be used
    this.selectedRoleIds.push(...this.selectedApproveRequiredRole);
    
    if(!this.selectedRoleIds.some((roleId) => roleId == this.selectedUserType.id)){
      this.selectedRoleIds.push(this.selectedUserType.id);
    }
    return this.selectedRoleIds;
  }

  private invalidDomainConfig(role: any) {
    let filterRole = this.approveRequiredRole.find((element: { roleKey: any; }) => element.roleKey == role.roleKey);
    let roleAlredyApprovedAndAssigned = this.userProfileResponseInfo?.detail?.rolePermissionInfo?.find(x => x.roleKey == role.roleKey);

    if (filterRole === undefined || (filterRole && roleAlredyApprovedAndAssigned)) {
      this.selectedRoleIds.push(role.roleId)
    } else {
      this.pendingRolecheck(role)
    }
  }

  private pendingRolecheck(role: any) {
    if (this.pendingRoleDetails.length != 0) {
      this.whenPendingRoleHavingLength(role)
    } else {
      this.whenPendingRoleNoLength(role)
    }
  }

  private whenPendingRoleHavingLength(role: any) {
    let filterAlreadyExistRole = this.pendingRoleDetails.find((element: { roleKey: any; }) => element.roleKey == role.roleKey);

    if (!filterAlreadyExistRole) {
      this.selectedApproveRequiredRole.push(role.roleId)
    } else {
      // Remove below line to seperate normal and approval required role. It is added as we will not be using seperate api. Only user update api will be used
      this.selectedRoleIds.push(role.roleId);
    }
  }

  private whenPendingRoleNoLength(role: any) {
    if (!role.enabled) {
      this.selectedApproveRequiredRole.push(role.roleId)
    } else {
      this.selectedRoleIds.push(role.roleId)
    }
  }

  private submitPendingApproveRole(): void {
    let selectedRolesDetails = {
      userName: this.userProfileRequestInfo.userName,
      organisationId: this.userProfileRequestInfo.organisationId,
      detail: {
        roleIds: this.selectedApproveRequiredRole
      }
    }
    if (this.selectedApproveRequiredRole.length != 0 && this.isInvalidDomain) {
      this.UpdatePendingApproveRole(selectedRolesDetails)
    } else if (this.pendingRoledeleteDetails.length != 0) {
      this.deleteApprovePendingRole()
    }

  }

  private UpdatePendingApproveRole(selectedRolesDetails: any) {
    this.wrapperUserService.createPendingApproveRole(selectedRolesDetails).subscribe({
      next: (roleInfo: UserEditResponseInfo) => {
        if (this.pendingRoledeleteDetails.length != 0) {
          this.deleteApprovePendingRole()
        }
      },
      error: (err: any) => {
        console.log(err)
      },
    });
  }

  saveChanges(actionMode: string, form: FormGroup) {
    if (actionMode === "update") {
      this.updateUser(form);
    } else if (actionMode === "create") {
      this.createUser(form);
    }
  }

  /**
   * checking approve required roles are availble
   */
  private checkApproveRolesSelected() {
    const superAdminDomain = this.organisationDetails.detail.domainName.toLowerCase()
    const userDomain = this.formGroup.get('userName')?.value.split("@")[1].toLowerCase()
    if (superAdminDomain != userDomain) {
      this.isInvalidDomain = true
      let matchRoles: any = []
      const selectedRole: any = this.selectedApproveRequiredRole
      this.orgRoles.forEach((allRole: Role) => {
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
      localStorage.setItem('user_access_name', this.userProfileRequestInfo.userName);
    }
  }

  updateUser(form: FormGroup) {
    this.userProfileRequestInfo.detail.groupIds = this.selectedGroupCheckboxes
    this.wrapperUserService
      .updateUser(
        this.userProfileRequestInfo.userName,
        this.userProfileRequestInfo
      )
      .subscribe({
        next: (userEditResponseInfo: UserEditResponseInfo) => {
          this.submitPendingApproveRole()
          if (
            userEditResponseInfo.userId == this.userProfileRequestInfo.userName
          ) {
            this.submitted = false;
            sessionStorage.setItem(
              SessionStorageKey.OperationSuccessUserName,
              this.editingUserName
            );
            this.router.navigateByUrl(
              `operation-success/${userEditResponseInfo.isRegisteredInIdam
                ? OperationEnum.UserUpdateWithIdamRegister
                : OperationEnum.UserUpdate
              }`
            );
          } else {
            console.log('Update not success');
          }
        },
        error: (err: any) => {
          if (err.error == 'MFA_DISABLED_USER') {
            this.mfaAdminValidationError = true;
            this.scrollView();
          }
        },
      });
  }

  createUser(form: FormGroup) {
    this.userProfileRequestInfo.detail.groupIds = this.selectedGroupCheckboxes
    this.wrapperUserService.createUser(this.userProfileRequestInfo).subscribe({
      next: (userEditResponseInfo: UserEditResponseInfo) => {
        this.submitted = false;
        this.submitPendingApproveRole()
        sessionStorage.setItem(
          SessionStorageKey.OperationSuccessUserName,
          this.editingUserName
        );
        this.router.navigateByUrl(
          `operation-success/${userEditResponseInfo.isRegisteredInIdam
            ? OperationEnum.UserCreateWithIdamRegister
            : OperationEnum.UserCreate
          }`
        );
      },
      error: (err: any) => {
        if (err.status == 409) {
          form.controls['userName'].setErrors({ alreadyExists: true });
          this.emailHaserror = true;
          this.scrollView();
        } else {
          if (err.error == 'INVALID_USER_ID') {
            form.controls['userName'].setErrors({ invalidEmail: true });
            this.scrollView();
          } else if (err.error == 'MFA_DISABLED_USER') {
            this.mfaAdminValidationError = true;
            this.scrollView();
          }
        }
      },
    });
  }

  private deleteApprovePendingRole(): void {
    const deleteRoleIds = this.pendingRoledeleteDetails.join();
    this.wrapperUserService.deleteApprovePendingRole(this.userProfileRequestInfo.userName, deleteRoleIds).subscribe({
      next: (userDeleteResponseInfo: UserEditResponseInfo) => {
      },
      error: (err: any) => {
        console.log("err", err)
      },
    });
  }

  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    if (
      this.identityProviders != null &&
      this.identityProviders != undefined &&
      this.identityProviders != []
    ) {
      let isIdpSelected = this.identityProviders.some(
        (idp) => form.get('signInProviderControl_' + idp.id)?.value === true
      );
      if (!isIdpSelected) {
        form.setErrors({ identityProviderRequired: true });
        // this.scrollView()
        return false;
      } else {
        form.setErrors(null);
      }
    }
    return form.valid;
  }

  onCancelClick() {
    sessionStorage.removeItem(SessionStorageKey.ManageUserUserName);
    this.router.navigateByUrl('manage-users');
  }

  onResetPasswordClick() {
    this.router.navigateByUrl('manage-users/confirm-reset-password');
  }

  onDeleteClick() {
    this.router.navigateByUrl('manage-users/confirm-user-delete');
  }

  public customFocus(): void {
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


  onUserRoleChecked(obj: any, isChecked: boolean) {
    var roleKey = obj.roleKey;
    if (isChecked == true) {
      // this.setMfaStatus(roleKey, true)
      if (obj.pendingStatus === true) {
        this.removePendingRole(obj)
      }
    }
    else if (isChecked == false) {
      // this.setMfaStatus(roleKey, false)
    }
  }

  private setMfaStatus(roleKey: any, status: boolean) {
    if (roleKey == 'ORG_ADMINISTRATOR' && this.selectedUserType.key !== 'ORG_DEFAULT_USER') {
      this.formGroup.controls['mfaEnabled'].setValue(status);
      this.isAutoDisableMFA = status;
    } else {
      this.formGroup.controls['mfaEnabled'].setValue(
        this.userProfileResponseInfo.mfaEnabled
      );
      this.isAutoDisableMFA = false;
    }
  }

  private removePendingRole(obj: any) {
    let filterRole = this.pendingRoledeleteDetails.find((element: number) => element == obj.roleId)
    if (filterRole != undefined) {
      this.pendingRoledeleteDetails.forEach((pRole: any, index: any) => {
        if (pRole === obj.roleId) {
          this.pendingRoledeleteDetails.splice(index, 1)
        }
      })
    }
  }


  public ResetAdditionalSecurity(): void {
    if (this.MFA_Enabled) {
      let data = {
        IsUser: true,
        data: this.formGroup.controls.userName.value,
        userName:
          this.formGroup.controls.firstName.value +
          ' ' +
          this.formGroup.controls.lastName.value,
      };
      this.router.navigateByUrl(
        'confirm-user-mfa-reset?data=' + btoa(JSON.stringify(data))
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  public getDisbleRoleForService(orgRoleKey: any) {
    if (orgRoleKey === 'ORG_DEFAULT_USER') {
      return true
    } else {
      return null
    }

  }

  public groupsMemberCheckBoxAddRoles(data: any) {
    this.setAdminDetails(data,true)
    this.selectedGroupCheckboxes.push(data.groupId);
    this.IsChangeInGroupSelection(this.userProfileResponseInfo?.detail?.userGroups?.map(x => x.groupId));

  }

  public groupsMemberCheckBoxRemoveRoles(data: any) {
    this.setAdminDetails(data,false)
    this.selectedGroupCheckboxes = this.removeObjectById(this.selectedGroupCheckboxes, data.groupId);
    this.IsChangeInGroupSelection(this.userProfileResponseInfo?.detail?.userGroups?.map(x => x.groupId));
  }

  public noneGroupsMemberCheckBoxAddRoles(data: any) {
    this.setAdminDetails(data,true)
    this.selectedGroupCheckboxes.push(data.groupId);
    this.IsChangeInGroupSelection(this.userProfileResponseInfo?.detail?.userGroups?.map(x => x.groupId));
  }

  public noneGroupsMemberCheckBoxRemoveRoles(data: any) {
    this.setAdminDetails(data,false)
    this.selectedGroupCheckboxes = this.removeObjectById(this.selectedGroupCheckboxes, data.groupId);
    this.IsChangeInGroupSelection(this.userProfileResponseInfo?.detail?.userGroups?.map(x => x.groupId));
  }

  private removeObjectById(arr: any, id: any) {
    return arr.filter((item: any) => item !== id);
  }

  private setAdminDetails(data: any,isChecked:boolean) {
    if(data.groupType === 1){
      this.userTypeDetails.selectedValue = (isChecked) ? 'ORG_ADMINISTRATOR' : 'ORG_DEFAULT_USER';
      if (this.userTypeDetails.selectedValue === 'ORG_ADMINISTRATOR') {
        this.selectedUserType = this.userTypeDetails.data.find(event => event.key === "ORG_ADMINISTRATOR")
        this.setMfaStatus('ORG_ADMINISTRATOR', true);
      } 
      else {
        this.selectedUserType = this.userTypeDetails.data.find(event => event.key === "ORG_DEFAULT_USER")
        this.setMfaStatus('ORG_ADMINISTRATOR', false);
      }
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
  }


  public IsChangeInGroupSelection(responseGroups: any): void {
    const isSelectedAndResponseGroupsSame = this.isEdit && !this.selectedGroupCheckboxes.every(groupId => responseGroups.includes(groupId));
    const isResponseGroupsSame = !responseGroups.every((groupId: any) => this.selectedGroupCheckboxes.includes(groupId));
    this.isFormGroupChanges = isSelectedAndResponseGroupsSame || isResponseGroupsSame || !this.isEdit && this.selectedGroupCheckboxes.length !== 0;
  }


  public get isFormChanges(){
    return this.formChanged || this.isFormGroupChanges || this.isFormUserTypeChanges;
  }

  public onUserTypeChanged(event:any){
    this.selectedUserType = event;
    if(event.key === 'ORG_ADMINISTRATOR'){
      this.setMfaandAdminGroup()
    }
    else{
      this.removeMfaandAdminGroup()
    }    
    this.updateFormUserTypeChanged(event);
  }

  
  private setMfaandAdminGroup(){
  const matchedObject = this.noneGroupsMember.data.find(obj => obj.groupType === 1);
   if (matchedObject) {
    matchedObject.checked = true;
    this.selectedGroupCheckboxes.push(matchedObject.groupId);
   } else {
   const matchedObject = this.groupsMember.data.find(obj => obj.groupType === 1);
    if (matchedObject) {
      matchedObject.checked = true;
      this.selectedGroupCheckboxes.push(matchedObject.groupId);
     } 
   }
    this.setMfaStatus('ORG_ADMINISTRATOR', true);
  }

  private removeMfaandAdminGroup(){
    const matchedObject = this.noneGroupsMember.data.find(obj => obj.groupType === 1);
    if (matchedObject) {
       matchedObject.checked = false;
       this.selectedGroupCheckboxes = this.removeObjectById(this.selectedGroupCheckboxes, matchedObject.groupId);
    } else {
    const matchedObject = this.groupsMember.data.find(obj => obj.groupType === 1);
      if(matchedObject){
        matchedObject.checked = false;
        this.selectedGroupCheckboxes = this.removeObjectById(this.selectedGroupCheckboxes, matchedObject.groupId);
      }
    }
  this.setMfaStatus('ORG_ADMINISTRATOR', false);
  }

  public updateFormUserTypeChanged(event:any){
    if(this.oldSelectedUserType !== event.key)
    {
      this.isFormUserTypeChanges = true;
    }
    else{
      this.isFormUserTypeChanges = false;
    }
  }

  private removeDefaultUserRoleFromServiceRole(){
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
}
