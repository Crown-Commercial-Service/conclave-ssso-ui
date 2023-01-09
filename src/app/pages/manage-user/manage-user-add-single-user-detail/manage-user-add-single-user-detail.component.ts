import {
  Component,
  ElementRef,
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
import {
  UserEditResponseInfo,
  UserProfileRequestInfo,
  UserProfileResponseInfo,
} from 'src/app/models/user';
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

@Component({
  selector: 'app-manage-user-add-single-user-detail',
  templateUrl: './manage-user-add-single-user-detail.component.html',
  styleUrls: ['./manage-user-add-single-user-detail.component.scss'],
})
export class ManageUserAddSingleUserDetailComponent
  extends FormBaseComponent
  implements OnInit {
  organisationId: string;
  userProfileRequestInfo: UserProfileRequestInfo;
  userProfileResponseInfo: UserProfileResponseInfo;
  submitted!: boolean;
  orgGroups: Group[];
  orgRoles: Role[];
  identityProviders: IdentityProvider[];
  allIdps: IdentityProvider[];
  isEdit: boolean = false;
  isAutoDisableMFA: boolean = false;
  editingUserName: string = '';
  userTitleEnum = UserTitleEnum;
  errorLinkClicked: boolean = false;
  routeData: any = {};
  state: any;
  hasGroupViewPermission: boolean = false;
  mfaAdminValidationError: boolean = false;
  public idpStatus = environment.appSetting.hideIDP
  public approveRequiredRole: Role[];
  public organisationDetails: any = {}
  public pendingRoleDetails: any;
  public selectedApproveRequiredRole: any = []
  public pendingRoledeleteDetails: any = []
  public detailsData: any = [
    'Add additional security steps to make an account more secure. Additional security needs to be enabled for all admin users. This can be accessed using a personal or work digital device.',
    'Groups allow you to manage large numbers of users all at once. Roles can be applied to groups to organise user’s more efficiently and allow bulk access to relevant services where it is required.',
    'The roles selected here will set what services are available to your users.',
  ];
  userTitleArray = ['Mr', 'Mrs', 'Miss', 'Ms', 'Doctor', 'Unspecified'];
  public emailHaserror: boolean = false;
  public MFA_Enabled: any = false;
  ciiOrganisationId: string;
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
    private organisationService: WrapperOrganisationService
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
    // this.locationStrategy.onPopState(() => {
    //   this.onCancelClick();
    // });
    if (queryParams.data) {
      this.routeData = JSON.parse(atob(queryParams.data));
      this.isEdit = this.routeData['isEdit'];
      this.editingUserName =
        sessionStorage.getItem(SessionStorageKey.ManageUserUserName) ?? '';
      this.editingUserName = this.routeData.rowData;
    }
    this.orgGroups = [];
    this.orgRoles = [];
    this.identityProviders = [];
    this.allIdps = [];
    this.approveRequiredRole = []
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.userProfileRequestInfo = {
      organisationId: this.organisationId,
      title: 'undefined',
      userName: '',
      mfaEnabled: false,
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
      await this.getOrgGroups();
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
      await this.getOrgGroups();
      await this.getOrgRoles();
      await this.getIdentityProviders();
      this.onFormValueChange();
    }
    await this.getPendingApprovalUserRole();
    await this.getApprovalRequriedRoles()
    await this.getOrgDetails()
    this.MFA_Enabled = this.formGroup.controls.mfaEnabled.value;
  }

  async getIdentityProviders() {
    let masterIdps = await this.configWrapperService.getIdentityProviders().toPromise().catch();
    this.identityProviders = await this.organisationGroupService.getOrganisationIdentityProviders(this.organisationId).toPromise();
    console.log(this.userProfileResponseInfo.detail.identityProviders);
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

  async getOrgGroups() {
    let orgGrpList = await this.organisationGroupService
      .getOrganisationGroups(this.organisationId)
      .toPromise<GroupList>();
    this.orgGroups = orgGrpList.groupList;
    this.orgGroups.forEach((group) => {
      let isGroupOfUser =
        this.userProfileResponseInfo.detail &&
        this.userProfileResponseInfo.detail.userGroups &&
        this.userProfileResponseInfo.detail.userGroups.some(
          (ug) => ug.groupId == group.groupId
        );
      this.formGroup.addControl(
        'orgGroupControl_' + group.groupId,
        this.formBuilder.control(isGroupOfUser ? true : '')
      );
    });
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
       let PendinguserRole = this.pendingRoleDetails.some(
        (pendingRole: any) => pendingRole.roleKey == role.roleKey
      );
      this.formGroup.addControl(
        'orgRoleControl_' + role.roleId,
        this.formBuilder.control(userRole ? true : PendinguserRole ? true : '')
      );
      //Edit mode Determin Login user whether Admin/Normal user.
      if (
        role.roleKey == 'ORG_ADMINISTRATOR' &&
        userRole == true &&
        this.isAutoDisableMFA == false
      ) {
        this.isAutoDisableMFA = true;
      }
      let filterRole = this.pendingRoleDetails.find((element: { roleKey: any; }) => element.roleKey == role.roleKey)
      if (filterRole != undefined) {
        role.pendingStatus = true
      }
    });
  }

  async getApprovalRequriedRoles() {
    this.approveRequiredRole = await this.organisationGroupService
      .getOrganisationApprovalRequiredRoles(this.organisationId)
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


  // ngAfterViewChecked() {
  //     if (!this.errorLinkClicked) {
  //         // This additional check has been done to avoid always scrolling to error summary because ngAfterViewChecked is triggered with dynamic form controls
  //         this.scrollHelper.doScroll();
  //     } else {
  //         this.errorLinkClicked = false;
  //     }
  // }

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
      this.userProfileRequestInfo.detail.groupIds =
        this.getSelectedGroupIds(form);
      this.userProfileRequestInfo.detail.roleIds =
        this.getSelectedRoleIds(form);
      this.checkApproveRolesSelected()
      if (this.isEdit) {
        this.submitPendingApproveRole("update", form)
      } else {
        this.submitPendingApproveRole("create", form)
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

  getSelectedGroupIds(form: FormGroup) {
    let selectedGroupIds: number[] = [];
    this.orgGroups.map((group) => {
      if (form.get('orgGroupControl_' + group.groupId)?.value === true) {
        selectedGroupIds.push(group.groupId);
      }
    });
    return selectedGroupIds;
  }



  getSelectedRoleIds(form: FormGroup) {
    let selectedRoleIds: number[] = [];
    this.selectedApproveRequiredRole = []
    this.orgRoles.map((role) => {
      if (form.get('orgRoleControl_' + role.roleId)?.value === true) {
        let filterRole = this.approveRequiredRole.find((element: { roleKey: any; }) => element.roleKey == role.roleKey)
        if (filterRole === undefined) {
          selectedRoleIds.push(role.roleId);
        } else {
          this.selectedApproveRequiredRole.push(role.roleId)
        }
      }
    });
    return selectedRoleIds;
  }


  private submitPendingApproveRole(actionMode: string, form: FormGroup): void {
    debugger
    let selectedRolesDetails = {
      userName: this.userProfileRequestInfo.userName,
      detail: {
        roleIds: this.selectedApproveRequiredRole
      }
    }
    if (this.selectedApproveRequiredRole.length != 0) {
      this.wrapperUserService.createPendingApproveRole(selectedRolesDetails).subscribe({
        next: (roleInfo: UserEditResponseInfo) => {
          if (this.pendingRoledeleteDetails.length != 0) {
            this.deleteApprovePendingRole(actionMode, form)
          } else {
            this.saveChanges(actionMode, form)
          }
        },
        error: (err: any) => {
          console.log(err)
        },
      });
    } else {
      if (this.pendingRoledeleteDetails.length != 0) {
        this.deleteApprovePendingRole(actionMode, form)
      } else {
        this.saveChanges(actionMode, form)
      }
    }

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
    const superAdminDomain = this.organisationDetails.detail.domainName
    const userDomain = this.formGroup.get('userName')?.value.split("@")[1]
    if (superAdminDomain != userDomain) {
      let matchRoles: any = []
      let filterRole: any;
      const selectedRole: any = this.userProfileRequestInfo.detail.roleIds
      selectedRole.forEach((selectedRole: number) => {
        filterRole = this.orgRoles.find((element: { roleId: any; }) => element.roleId == selectedRole)
        this.approveRequiredRole.forEach((approveRequiredRole) => {
          if (filterRole.roleKey === approveRequiredRole.roleKey) {
            matchRoles.push(approveRequiredRole)
          }
        })
      })
      localStorage.setItem('user_approved_role', JSON.stringify(matchRoles));
    }
  }

  updateUser(form: FormGroup) {
    this.wrapperUserService
      .updateUser(
        this.userProfileRequestInfo.userName,
        this.userProfileRequestInfo
      )
      .subscribe({
        next: (userEditResponseInfo: UserEditResponseInfo) => {
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
    this.wrapperUserService.createUser(this.userProfileRequestInfo).subscribe({
      next: (userEditResponseInfo: UserEditResponseInfo) => {
        this.submitted = false;
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

  private deleteApprovePendingRole(actionMode: string, form: FormGroup): void {
    const deleteRoleIds = this.pendingRoledeleteDetails.join();
    this.wrapperUserService.deleteApprovePendingRole(this.userProfileRequestInfo.userName, deleteRoleIds).subscribe({
      next: (userDeleteResponseInfo: UserEditResponseInfo) => {
        this.saveChanges(actionMode, form)
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
  onGroupViewClick(groupId: any) {
    var formData: UserProfileResponseInfo = {
      title: this.formGroup.get('userTitle')?.value,
      firstName: this.formGroup.get('firstName')?.value,
      lastName: this.formGroup.get('lastName')?.value,
      userName: this.formGroup.get('userName')?.value,
      mfaEnabled: this.formGroup.get('mfaEnabled')?.value,
      isAdminUser: false,
      detail: {
        id: this.userProfileResponseInfo.detail.id,
        canChangePassword:
          this.userProfileResponseInfo.detail.canChangePassword,
        identityProviders: [],
        userGroups: [],
        rolePermissionInfo: [],
      },
      organisationId: this.organisationId,
    };

    // Filter the selected identity providers and keep it in route change
    let selectedIdpIds = this.getSelectedIdpIds(this.formGroup);
    selectedIdpIds.forEach((selectedIdpId) => {
      if (
        !formData.detail.identityProviders?.some(
          (ug) => ug.identityProviderId == selectedIdpId
        )
      ) {
        formData.detail.identityProviders &&
          formData.detail.identityProviders.push({
            identityProviderId: selectedIdpId,
          });
      }
    });

    // Filter the selected groups and keep it in route change
    let selectedGroupIds = this.getSelectedGroupIds(this.formGroup);
    selectedGroupIds.forEach((selectedGroupId) => {
      if (
        !(
          formData.detail.userGroups &&
          formData.detail.userGroups.some((ug) => ug.groupId == selectedGroupId)
        )
      ) {
        formData.detail.userGroups &&
          formData.detail.userGroups.push({
            groupId: selectedGroupId,
            group: '',
            accessRole: '',
            accessRoleName: '',
            serviceClientId: '',
          });
      }
    });

    // Filter the selected roles and keep it in route change
    let selectedRoleIds = this.getSelectedRoleIds(this.formGroup);
    selectedRoleIds.forEach((selectedRoleId) => {
      if (
        !(
          formData.detail.rolePermissionInfo &&
          formData.detail.rolePermissionInfo.some(
            (ug) => ug.roleId == selectedRoleId
          )
        )
      ) {
        formData.detail.rolePermissionInfo &&
          formData.detail.rolePermissionInfo.push({
            roleId: selectedRoleId,
            roleKey: '',
            roleName: '',
            serviceClientId: '',
            serviceClientName: '',
          });
      }
    });

    let data = {
      isEdit: false,
      groupId: groupId,
    };
    this.router.navigateByUrl(
      'manage-groups/view?data=' + JSON.stringify(data),
      { state: { formData: formData, routeUrl: this.router.url } }
    );
  }

  onUserRoleChecked(obj: any, isChecked: boolean) {
    var roleKey = obj.roleKey;
    if (isChecked == true) {
      if (roleKey == 'ORG_ADMINISTRATOR') {
        this.formGroup.controls['mfaEnabled'].setValue(true);
        this.isAutoDisableMFA = true;
      }
    }
    else if (isChecked == false) {
      if (roleKey == 'ORG_ADMINISTRATOR') {
        this.formGroup.controls['mfaEnabled'].setValue(false);
        this.isAutoDisableMFA = false;
      }
      if (obj.pendingStatus === true) {
        let filterRole = this.pendingRoledeleteDetails.find((element: number) => element == obj.roleId)
        if (filterRole === undefined) {
          this.pendingRoledeleteDetails.push(obj.roleId)
          console.log("this.pendingRoledeleteDetails", this.pendingRoledeleteDetails)
        }
      }
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
}
