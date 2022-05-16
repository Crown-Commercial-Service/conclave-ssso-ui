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
import { OrganisationGroupRequestInfo, Role } from "src/app/models/organisationGroup";
import { WrapperOrganisationService } from "src/app/services/wrapper/wrapper-org-service";
import { UserListInfo } from "src/app/models/user";
import { OperationEnum } from "src/app/constants/enum";
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-manage-group-edit-roles-confirm',
    templateUrl: './manage-group-edit-roles-confirm-component.html',
    styleUrls: ['./manage-group-edit-roles-confirm-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageGroupEditRolesConfirmComponent extends BaseComponent implements OnInit {
    organisationId: string;
    isEdit: boolean = false;
    editingGroupId: number = 0;
    groupName: string = '';
    roleIds: number[] = [];
    addingRoles: Role[] = [];
    removingRoles: Role[] = [];
    routeData: any = {};
    userCount: number = 0;
    rolesTableHeaders = ['NAME'];
    rolesColumnsToDisplay = ['roleName'];

    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private orgGroupService: WrapperOrganisationGroupService,
        private wrapperOrganisationService: WrapperOrganisationService) {
        super(uiStore,viewportScroller,scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            this.routeData = JSON.parse(queryParams.data);
            this.isEdit = this.routeData['isEdit'];
            this.editingGroupId = this.routeData['groupId'];
            this.roleIds = this.routeData['roleIds'];
            this.addingRoles = this.routeData['addingRoles'];
            this.removingRoles = this.routeData['removingRoles'] || [];
            this.userCount = this.routeData['userCount'] || 0;
            this.groupName = this.routeData.groupName;
        }
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    }

    ngOnInit() {
        this.titleService.setTitle(`Confirm - ${"Group - Roles"}`);
    }

    onConfirmClick() {
        let groupPatchRequestInfo: OrganisationGroupRequestInfo = {
            roleInfo: {
                addedRoleIds: this.addingRoles.map(ar => ar.roleId),
                removedRoleIds: this.removingRoles.map(rr => rr.roleId)
            }
        };
        console.log(groupPatchRequestInfo);

        this.orgGroupService.patchUpdateOrganisationGroup(this.organisationId, this.editingGroupId, groupPatchRequestInfo)
            .subscribe(
                (result) => {
                    let data = {
                        'isEdit': this.isEdit,
                        'groupId': this.editingGroupId,
                        'roleCount': this.addingRoles.length,
                        'userCount': this.userCount
                    };
                    this.router.navigateByUrl(`manage-groups/operation-success/${this.isEdit ? OperationEnum.GroupRoleUpdate : OperationEnum.GroupAdd}?data=` + JSON.stringify(data));
                },
                (error) => {
                    if (error.error == 'MFA_DISABLED_USERS_INCLUDED') {
                        let data = {
                            'isEdit': this.isEdit,
                            'groupId': this.editingGroupId
                        };
                        this.router.navigateByUrl(`manage-groups/error?data=` + JSON.stringify(data));
                    }
                });
    }

    onGoToEditGroupClick() {
        this.routeData.isEdit = true;
        this.router.navigateByUrl("manage-groups/view?data=" + JSON.stringify(this.routeData));
    }

    onCancelClick() {
        this.router.navigateByUrl("manage-groups/edit-roles?data=" + JSON.stringify(this.routeData));
    }
}