import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocationStrategy, ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserGroup, UserProfileRequestInfo } from 'src/app/models/user';
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
  userRoleColumnsToDisplay = ['accessRoleName', 'serviceName'];
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
  private isAdminUser: boolean = false;
  userGroups: UserGroup[] = [];
  userContacts: ContactGridInfo[] = [];
  userName: string;
  organisationId: string;
  canChangePassword: boolean = false;
  identityProviderDisplayName: string = '';
  roleDataList: any[] = [];
  routeStateData: any = {};
  hasGroupViewPermission: boolean = false;

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
    private auditLogService: AuditLoggerService
  ) {
    super(
      viewportScroller,
      formBuilder.group({
        firstName: ['', Validators.compose([Validators.required])],
        lastName: ['', Validators.compose([Validators.required])],
        mfaEnabled: [false],
      })
    );
    this.userName = localStorage.getItem('user_name') || '';
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.routeStateData = this.router.getCurrentNavigation()?.extras.state;
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
      this.identityProviderDisplayName =
        user.detail.identityProviders
          ?.map((idp) => idp.identityProviderDisplayName)
          .join(',') || '';
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

    await this.orgGroupService
      .getOrganisationRoles(this.organisationId)
      .toPromise()
      .then((orgRoles: Role[]) => {
        user.detail.rolePermissionInfo &&
          user.detail.rolePermissionInfo.map((roleInfo) => {
            var orgRole = orgRoles.find((r) => r.roleId == roleInfo.roleId);
            if (orgRole) {
              //Determin Login user whether Admin/Normal user.
              if (
                orgRole.roleKey == 'ORG_ADMINISTRATOR' &&
                this.isAdminUser == false
              ) {
                this.isAdminUser = true;
              }
            }
          });

        //Push Roles based on User Type
        if (this.isAdminUser == true) {
          console.log('admin user');
          orgRoles.forEach((element) => {
            this.roleDataList.push({
              accessRoleName: element.roleName,
              serviceName: element.serviceName,
            });
          });
        } else {
          console.log('Normal user');
          user.detail.rolePermissionInfo &&
            user.detail.rolePermissionInfo.map((roleInfo) => {
              var orgRole = orgRoles.find((r) => r.roleId == roleInfo.roleId);
              if (orgRole) {
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
      error: (error: any) => {},
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
        detail: {
          id: 0,
        },
        firstName: form.get('firstName')?.value,
        lastName: form.get('lastName')?.value,
      };
      this.userService.updateUser(this.userName, userRequest).subscribe(
        (data) => {
          this.router.navigateByUrl(
            `operation-success/${OperationEnum.MyAccountUpdate}`
          );
        },
        (error) => {
          console.log(error);
          console.log(error.error);
        }
      );
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
    };
    this.router.navigateByUrl(
      'manage-groups/view?data=' + JSON.stringify(data),
      { state: { formData: formData, routeUrl: this.router.url } }
    );
  }
}
