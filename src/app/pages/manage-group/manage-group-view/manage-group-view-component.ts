import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller, Location, LocationStrategy } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { WrapperOrganisationGroupService } from "src/app/services/wrapper/wrapper-org--group-service";
import { OrganisationGroupResponseInfo } from "src/app/models/organisationGroup";
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-manage-group-view',
    templateUrl: './manage-group-view-component.html',
    styleUrls: ['./manage-group-view-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageGroupViewComponent extends BaseComponent implements OnInit {
    organisationId: string;
    group: OrganisationGroupResponseInfo;
    isEdit: boolean = false;
    editingGroupId: number = 0;
    routeData: any = {};
    usersTableHeaders = ['NAME', 'EMAIL'];
    usersColumnsToDisplay = ['name', 'userId'];
    rolesTableHeaders = ['NAME'];
    roesColumnsToDisplay = ['name'];

    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private orgGroupService: WrapperOrganisationGroupService,
        private locationStrategy: LocationStrategy, private titleService: Title) {
        super(uiStore, viewportScroller, scrollHelper);
        this.group = {
            groupId: 0,
            mfaEnabled: false,
            groupName: '',
            roles: [],
            users: []
        };
        let queryParams = this.activatedRoute.snapshot.queryParams;
        let state = this.router.getCurrentNavigation()?.extras.state;
        if (state) {
            sessionStorage.setItem('groupReadonlyViewState', JSON.stringify(state));
        }
        this.locationStrategy.onPopState(() => {
            if (state) {
                this.onGoBackClick();
            }
        });

        if (queryParams.data) {
            this.routeData = JSON.parse(queryParams.data);
            this.isEdit = this.routeData['isEdit'];
            this.editingGroupId = this.routeData['groupId'];
        }
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.clearSessionStorageGroupUserData();
    }

    ngOnInit() {
        this.titleService.setTitle(`${this.isEdit ? 'Edit' : 'View'} - Manage Groups - CCS`);
        this.orgGroupService.getOrganisationGroup(this.organisationId, this.editingGroupId)
            .subscribe(
                (group: OrganisationGroupResponseInfo) => {
                    this.group = group;
                },
                (error) => {
                    console.log(error);
                    console.log(error.error);
                });
    }

    onNameEditClick() {
        let data = {
            'isEdit': this.isEdit,
            'groupId': this.editingGroupId,
            'groupName': this.group.groupName
        };
        this.router.navigateByUrl('manage-groups/edit-name?data=' + JSON.stringify(data));
    }

    onRoleEditClick() {
        let roleIds = this.group.roles.map(role => role.id);
        let data = {
            'isEdit': this.isEdit,
            'groupId': this.editingGroupId,
            'roleIds': roleIds,
            'groupName': this.group.groupName
        };
        this.router.navigateByUrl('manage-groups/edit-roles?data=' + JSON.stringify(data));
    }

    onUserEditClick() {
        let userNames = this.group.users.map(user => user.userId);
        sessionStorage.setItem("group_existing_users", JSON.stringify(userNames))
        let data = {
            'isEdit': this.isEdit,
            'groupId': this.editingGroupId,
            'groupName': this.group.groupName
        };
        this.router.navigateByUrl('manage-groups/edit-users?data=' + JSON.stringify(data));
    }

    onDeleteClick() {
        console.log("delete");
        let data = {
            'isEdit': true,
            'organisationId': this.organisationId,
            'groupId': this.editingGroupId
        };
        this.router.navigateByUrl('manage-groups/delete-group-confirm?data=' + JSON.stringify(data));
    }

    onGoBackClick() {
        let stateString = sessionStorage.getItem('groupReadonlyViewState') || '';
        sessionStorage.removeItem('groupReadonlyViewState');
        let state = JSON.parse(stateString);
        let routeUrl = state.routeUrl;
        let formData = state.formData;

        this.router.navigateByUrl(`${routeUrl}`, { state: formData || {} });
    }

    clearSessionStorageGroupUserData() {
        sessionStorage.removeItem("group_existing_users");
        sessionStorage.removeItem("group_added_users");
        sessionStorage.removeItem("group_removed_users");
    }
}