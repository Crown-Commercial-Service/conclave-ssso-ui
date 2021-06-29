import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { KeyValue, Location, LocationStrategy, ViewportScroller } from '@angular/common';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum, UserTitleEnum } from 'src/app/constants/enum';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { UserEditResponseInfo, UserProfileRequestInfo, UserProfileResponseInfo } from 'src/app/models/user';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { Group, GroupList, Role } from 'src/app/models/organisationGroup';
import { IdentityProvider } from 'src/app/models/identityProvider';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-manage-user-add-single-user-detail',
    templateUrl: './manage-user-add-single-user-detail.component.html',
    styleUrls: ['./manage-user-add-single-user-detail.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageUserAddSingleUserDetailComponent extends BaseComponent implements OnInit {

    organisationId: string;
    userProfileRequestInfo: UserProfileRequestInfo;
    userProfileResponseInfo: UserProfileResponseInfo;
    userProfileForm: FormGroup;
    submitted!: boolean;
    orgGroups: Group[];
    orgRoles: Role[];
    identityProviders: IdentityProvider[];
    isEdit: boolean = false;
    editingUserName: string = "";
    userTitleEnum = UserTitleEnum;
    errorLinkClicked: boolean = false;
    routeData: any = {};
    state: any;
    hasGroupViewPermission: boolean = false;

    @ViewChildren('input') inputs!: QueryList<ElementRef>;

    constructor(private organisationGroupService: WrapperOrganisationGroupService, private formBuilder: FormBuilder, private router: Router,
        private location: Location, private activatedRoute: ActivatedRoute, protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private configurationService: WrapperConfigurationService,
        private wrapperUserService: WrapperUserService, private authService: AuthService, private locationStrategy: LocationStrategy) {
        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        this.state = this.router.getCurrentNavigation()?.extras.state;
        this.locationStrategy.onPopState(() => {
            this.onCancelClick();
        });
        if (queryParams.data) {
            this.routeData = JSON.parse(queryParams.data);
            this.isEdit = this.routeData['isEdit'];
            this.editingUserName = this.routeData['userName'];
        }
        this.orgGroups = [];
        this.orgRoles = [];
        this.identityProviders = [];
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.userProfileRequestInfo = {
            organisationId: this.organisationId,
            title: 0,
            userName: '',
            detail: {
                id: 0,
                groupIds: [],
                roleIds: []
            },
            firstName: '',
            lastName: '',

        };
        this.userProfileResponseInfo = {
            userName: '',
            detail: {
                id: 0,
                canChangePassword: false,
            },
            organisationId: this.organisationId,
            title: 0,
            firstName: '',
            lastName: '',
        };
        this.userProfileForm = this.formBuilder.group({
            userTitle: ['', Validators.compose([Validators.required])],
            firstName: ['', Validators.compose([Validators.required])],
            lastName: ['', Validators.compose([Validators.required])],
            userName: ['', Validators.compose([Validators.required, Validators.email])],
            signInProviderControl: ['', Validators.compose([Validators.required])]
        });
        //this.viewportScroller.setOffset([0, 100]);
    }

    async ngOnInit() {
        this.authService.hasPermission('MANAGE_GROUPS').subscribe({
            next: (hasPermission: boolean) => {
                this.hasGroupViewPermission = hasPermission;
            },
            error: (error: any) => {
                console.log(error);
            }
        });
        if (this.isEdit) {
            let userProfileResponseInfo = await this.wrapperUserService.getUser(this.editingUserName).toPromise();
            if (this.state) {
                this.userProfileResponseInfo = this.state;
            }
            else {
                this.userProfileResponseInfo = userProfileResponseInfo;
            }
            this.userProfileForm.controls['userTitle'].setValue(this.userProfileResponseInfo.title);
            this.userProfileForm.controls['firstName'].setValue(this.userProfileResponseInfo.firstName);
            this.userProfileForm.controls['lastName'].setValue(this.userProfileResponseInfo.lastName);
            this.userProfileForm.controls['userName'].setValue(this.userProfileResponseInfo.userName);
            await this.getOrgGroups();
            await this.getOrgRoles();
            await this.getIdentityProviders();
        }
        else {
            if (this.state) {
                this.userProfileResponseInfo = this.state;
                this.userProfileForm.controls['userTitle'].setValue(this.userProfileResponseInfo.title);
                this.userProfileForm.controls['firstName'].setValue(this.userProfileResponseInfo.firstName);
                this.userProfileForm.controls['lastName'].setValue(this.userProfileResponseInfo.lastName);
                this.userProfileForm.controls['userName'].setValue(this.userProfileResponseInfo.userName);
            }
            await this.getOrgGroups();
            await this.getOrgRoles();
            await this.getIdentityProviders();
        }
    }

    async getIdentityProviders() {
        this.identityProviders = await this.organisationGroupService.getOrganisationIdentityProviders(this.organisationId).toPromise();
        this.userProfileForm.controls['signInProviderControl'].setValue(this.userProfileResponseInfo.detail.identityProviderId || '');
    }

    async getOrgGroups() {
        let orgGrpList = await this.organisationGroupService.getOrganisationGroups(this.organisationId).toPromise<GroupList>();
        this.orgGroups = orgGrpList.groupList;
        this.orgGroups.forEach(group => {
            let isGroupOfUser = this.userProfileResponseInfo.detail &&
                this.userProfileResponseInfo.detail.userGroups && this.userProfileResponseInfo.detail.userGroups.some(ug => ug.groupId == group.groupId);
            this.userProfileForm.addControl('orgGroupControl_' + group.groupId, this.formBuilder.control(isGroupOfUser ? true : ''));
        });
    }

    async getOrgRoles() {
        this.orgRoles = await this.organisationGroupService.getOrganisationRoles(this.organisationId).toPromise();
        this.orgRoles.map(role => {
            let isRoleOfUser = this.userProfileResponseInfo.detail.rolePermissionInfo &&
                this.userProfileResponseInfo.detail.rolePermissionInfo.some(rp => rp.roleId == role.roleId)
            this.userProfileForm.addControl('orgRoleControl_' + role.roleId, this.formBuilder.control(isRoleOfUser ? true : ''));
        });
    }

    ngAfterViewChecked() {
        if (!this.errorLinkClicked) {
            // This additional check has been done to avoid always scrolling to error summary because ngAfterViewChecked is triggered with dynamic form controls
            this.scrollHelper.doScroll();
        } else {
            this.errorLinkClicked = false;
        }
    }

    scrollToAnchor(elementId: string): void {
        this.errorLinkClicked = true; // Making the errorLinkClicked true to avoid scrolling to the error-summary
        this.viewportScroller.scrollToAnchor(elementId);
    }

    setFocus(inputIndex: number) {
        this.inputs.toArray()[inputIndex].nativeElement.focus();
    }

    public onSubmit(form: FormGroup) {

        this.submitted = true;
        if (this.formValid(form)) {
            this.userProfileRequestInfo.title = form.get('userTitle')?.value;
            this.userProfileRequestInfo.firstName = form.get('firstName')?.value;
            this.userProfileRequestInfo.lastName = form.get('lastName')?.value;
            this.userProfileRequestInfo.userName = form.get('userName')?.value;
            let identityProviderId = form.get('signInProviderControl')?.value || 0;
            this.userProfileRequestInfo.detail.identityProviderId = identityProviderId;

            this.userProfileRequestInfo.detail.groupIds = this.getSelectedGroupIds(form);


            this.userProfileRequestInfo.detail.roleIds = this.getSelectedRoleIds(form);

            if (this.isEdit) {
                this.updateUser();
            }
            else {
                this.createUser(form);
            }

        }
        else {
            this.scrollHelper.scrollToFirst('error-summary');
        }
    }

    getSelectedGroupIds(form: FormGroup) {
        let selectedGroupIds: number[] = [];
        this.orgGroups.map(group => {
            if (form.get('orgGroupControl_' + group.groupId)?.value === true) {
                selectedGroupIds.push(group.groupId);
            }
        });

        return selectedGroupIds;
    }

    getSelectedRoleIds(form: FormGroup) {
        let selectedRoleIds: number[] = [];
        this.orgRoles.map(role => {
            if (form.get('orgRoleControl_' + role.roleId)?.value === true) {
                selectedRoleIds.push(role.roleId);
            }
        });

        return selectedRoleIds;
    }

    updateUser() {
        this.wrapperUserService.updateUser(this.userProfileRequestInfo.userName, this.userProfileRequestInfo).subscribe({
            next: (userEditResponseInfo: UserEditResponseInfo) => {
                if (userEditResponseInfo.userId == this.userProfileRequestInfo.userName) {
                    this.submitted = false;
                    let data = {
                        'userName': this.userProfileRequestInfo.userName
                    };
                    this.router.navigateByUrl(`operation-success/${userEditResponseInfo.isRegisteredInIdam ? OperationEnum.UserUpdateWithIdamRegister : OperationEnum.UserUpdate}?data=` + JSON.stringify(data));
                }
                else {
                    console.log("Update not success");
                }

            },
            error: (err: any) => {
                console.log("Update Error");
                console.log(err);
            }
        });
    }

    createUser(form: FormGroup) {
        this.wrapperUserService.createUser(this.userProfileRequestInfo).subscribe({
            next: (userEditResponseInfo: UserEditResponseInfo) => {
                this.submitted = false;
                let data = {
                    'userName': this.userProfileRequestInfo.userName
                };
                this.router.navigateByUrl(`operation-success/${userEditResponseInfo.isRegisteredInIdam ? OperationEnum.UserCreateWithIdamRegister : OperationEnum.UserCreate}?data=` + JSON.stringify(data));

            },
            error: (err: any) => {
                if (err.status == 409) {
                    form.controls['userName'].setErrors({ 'alreadyExists': true });
                    this.scrollHelper.scrollToFirst('error-summary');
                } else {
                    if (err.error = "INVALID_USER_ID") {
                        form.controls['userName'].setErrors({ 'invalidEmail': true });
                        this.scrollHelper.scrollToFirst('error-summary');
                    }
                }
                console.log(err);
            }
        });
    }

    formValid(form: FormGroup): Boolean {
        if (form == null) return false;
        if (form.controls == null) return false;
        return form.valid;
    }

    onCancelClick() {
        console.log("cancel");
        this.router.navigateByUrl('manage-users');
    }

    onResetPasswordClick() {
        let data = {
            'userName': this.editingUserName,
            'userId': this.userProfileResponseInfo.detail.id
        };
        this.router.navigateByUrl('manage-users/confirm-reset-password?data=' + JSON.stringify(data));
    }

    onDeleteClick() {
        let data = {
            'userName': this.editingUserName
        };
        this.router.navigateByUrl('manage-users/confirm-user-delete?data=' + JSON.stringify(data));
    }

    onGroupViewClick(groupId: any) {

        var formData: UserProfileResponseInfo = {
            title: this.userProfileForm.get('userTitle')?.value,
            firstName: this.userProfileForm.get('firstName')?.value,
            lastName: this.userProfileForm.get('lastName')?.value,
            userName: this.userProfileForm.get('userName')?.value,
            detail: {
                id: this.userProfileResponseInfo.detail.id,
                canChangePassword: this.userProfileResponseInfo.detail.canChangePassword,
                identityProviderId: this.userProfileForm.get('signInProviderControl')?.value || 0,
                userGroups: [],
                rolePermissionInfo: []
            },
            organisationId: this.organisationId,
        };
        // Filter the selected groups and keep it in route change
        let selectedGroupIds = this.getSelectedGroupIds(this.userProfileForm);
        selectedGroupIds.forEach(selectedGroupId => {
            if (!(formData.detail.userGroups && formData.detail.userGroups.some(ug => ug.groupId == selectedGroupId))) {
                formData.detail.userGroups && formData.detail.userGroups.push({
                    groupId: selectedGroupId,
                    group: '',
                    accessRole: '',
                    accessRoleName: '',
                    serviceClientId: ''
                });
            }
        });

        // Filter the selected roles and keep it in route change
        let selectedRoleIds = this.getSelectedRoleIds(this.userProfileForm);
        selectedRoleIds.forEach(selectedRoleId => {
            if (!(formData.detail.rolePermissionInfo && formData.detail.rolePermissionInfo.some(ug => ug.roleId == selectedRoleId))) {
                formData.detail.rolePermissionInfo && formData.detail.rolePermissionInfo.push({
                    roleId: selectedRoleId,
                    roleKey: '',
                    roleName: '',
                    serviceClientId: ''
                });
            }
        });

        let data = {
            'isEdit': false,
            'groupId': groupId
        };
        this.router.navigateByUrl('manage-groups/view?data=' + JSON.stringify(data), { state: { 'formData': formData, 'routeUrl': this.router.url } });
    }
}
