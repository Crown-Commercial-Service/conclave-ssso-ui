import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { WrapperOrganisationGroupService } from "src/app/services/wrapper/wrapper-org--group-service";
import { CheckBoxRoleListGridSource, Role } from "src/app/models/organisationGroup";
import { Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { SharedDataService } from "src/app/shared/shared-data.service";

@Component({
    selector: 'app-manage-group-edit-roles',
    templateUrl: './manage-group-edit-roles-component.html',
    styleUrls: ['./manage-group-edit-roles-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageGroupEditRolesComponent extends BaseComponent implements OnInit {
    public submitted!: boolean;
    public organisationId: string;
    public isEdit: boolean = false;
    public editingGroupId: number = 0;
    public groupName: string = '';
    public roleIds: number[] = [];
    public addingRoles: Role[] = [];
    public removingRoles: Role[] = [];
    public userCount: number = 0;
    public searchText: string = "";
    public rolesTableHeaders = ['NAME', 'SELECT_ROLE'];
    public rolesColumnsToDisplay = ['roleName'];
    public roleGridSource: any[] = [];
    public orgRoleList: Role[] = [];
    public searchSumbited: boolean = false;
    public serviceRoleGroup: any = {}
    public showRoleView: boolean = environment.appSetting.hideSimplifyRole
    public formGroup: FormGroup | any;
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private orgGroupService: WrapperOrganisationGroupService, private formBuilder: FormBuilder, private sharedDataService: SharedDataService) {
        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.isEdit = routeData['isEdit'];
            this.editingGroupId = routeData['groupId'];
            this.roleIds = routeData['roleIds'];
            this.groupName = routeData['groupName'] || '';
            this.addingRoles = routeData['addingRoles'] || [];
            this.removingRoles = routeData['removingRoles'] || [];
            this.userCount = routeData['userCount'] || 0;
        }
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        // this.viewportScroller.setOffset([100, 100]);
    }

    ngOnInit() {
        this.formGroup = new FormGroup({
            role: new FormControl()
        });
        if (this.showRoleView) {
            this.titleService.setTitle(`${this.isEdit ? "Add/Remove Roles" : "Add Roles"}  - Manage Groups - CCS`);
        } else {
            this.titleService.setTitle(`${this.isEdit ? "Add or remove services" : "Add services"}  - Manage Groups - CCS`);
        }
        this.getOrganisationRoles();
        this.initialteServiceRoleGroup()
    }

    ngAfterViewChecked() {
        this.scrollHelper.doScroll();
    }

    scrollToAnchor(elementId: string): void {
        this.viewportScroller.scrollToAnchor(elementId);
    }

    searchTextChanged(event: any) {
        this.searchText = event.target.value;
    }

    onSearchClick() {
        this.searchSumbited = true
        this.setSearchResult();
    }

    setSearchResult() {
        this.roleGridSource = [];
        this.orgRoleList.map((orgRole: Role) => {
            if (this.searchText == '' || orgRole.roleName.toLowerCase().includes(this.searchText.toLowerCase())) {
                let isChecked = (this.roleIds.findIndex(rId => rId == orgRole.roleId) != -1 ||
                    this.addingRoles.findIndex(role => role.roleId == orgRole.roleId) != -1) &&
                    this.removingRoles.findIndex(role => role.roleId == orgRole.roleId) == -1;

                let roleGridSourceObject: CheckBoxRoleListGridSource = {
                    roleId: orgRole.roleId,
                    roleKey: orgRole.roleKey,
                    roleName: orgRole.roleName,
                    isChecked: isChecked,
                    description: orgRole.description
                };
                this.formGroup.addControl(
                    'orgRoleControl_' + orgRole.roleId,
                    this.formBuilder.control(isChecked ? true : false)
                );
                this.roleGridSource.push(roleGridSourceObject);
            }
        });
        console.log("roleGridSource", this.roleGridSource)
    }


    public disableRoleCheck(dKey: string) {
        if (dKey == 'FP_USER' || dKey == "ACCESS_FP_CLIENT") {
            return true
        } else {
            return null
        }
    }

    getOrganisationRoles() {
        this.orgGroupService.getOrganisationRoles(this.organisationId).subscribe({
            next: (roleListResponse: Role[]) => {
                if (roleListResponse != null) {
                    this.orgRoleList = roleListResponse;
                    this.setSearchResult();
                }
            },
            error: (error: any) => {
            }
        });
    }

    onCheckBoxClickRow(dataRow: CheckBoxRoleListGridSource, event: any) {
        if (event) {
            let inRemovedListIndex = this.removingRoles.findIndex(rr => rr.roleId == dataRow.roleId);
            if (inRemovedListIndex != -1) { // If in removed list removing from there
                this.removingRoles.splice(inRemovedListIndex, 1);
            }
            else {
                let roleInfo: any = {
                    roleId: dataRow.roleId,
                    roleKey: dataRow.roleKey,
                    roleName: dataRow.roleName,
                    description: dataRow.description,
                    serviceView: !this.showRoleView
                };
                this.addingRoles.push(roleInfo);
            }
        }
        else {
            let inAddedListIndex = this.addingRoles.findIndex(ar => ar.roleId == dataRow.roleId);
            if (inAddedListIndex != -1) { // If in added list removing from there
                this.addingRoles.splice(inAddedListIndex, 1);
            }
            else {
                let roleInfo: any = {
                    roleId: dataRow.roleId,
                    roleKey: dataRow.roleKey,
                    roleName: dataRow.roleName,
                    description: dataRow.description,
                    serviceView: !this.showRoleView
                };
                this.removingRoles.push(roleInfo);
            }
        }
    }

    onContinueClick() {
        let data = {
            'isEdit': this.isEdit,
            'groupId': this.editingGroupId,
            'roleIds': this.roleIds,
            'addingRoles': this.addingRoles,
            'removingRoles': this.removingRoles,
            'userCount': this.userCount,
            'groupName': this.groupName
        };
        this.sharedDataService.storeRoleForGroup(JSON.stringify(data))
        this.router.navigateByUrl('manage-groups/edit-roles-confirm?data=' + JSON.stringify({ 'isEdit': this.isEdit }));
    }

    onCancelClick() {
        let data = {
            'isEdit': true,
            'groupId': this.editingGroupId
        };
        this.router.navigateByUrl('manage-groups/view?data=' + JSON.stringify(data));
    }

    private initialteServiceRoleGroup() {
        if (this.showRoleView) {
            this.serviceRoleGroup = {
                ADD_REMOVE_ROLES: 'Add or remove roles',
                ADD_ROLES: "Add roles",
                SELECT_ROLES_WANT_TO_ADD: "Select the roles you want to add. The roles applied to the group will set what services are available to the group members",
                SEARCH_FOR_ROLE: "Search for a role",
                ERROR_PREFIX: "Enter a role name",
                CREATE_BTN: "Create group with no roles"
            }
        } else {
            this.serviceRoleGroup = {
                ADD_REMOVE_ROLES: 'Add or remove services',
                ADD_ROLES: "Add services",
                SELECT_ROLES_WANT_TO_ADD: "Select the services that this group needs access to.",
                CREATE_BTN: "Create group with no services"
            }
        }
    }
}