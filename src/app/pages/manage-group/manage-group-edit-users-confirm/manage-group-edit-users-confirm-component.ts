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
import { OrganisationGroupRequestInfo } from "src/app/models/organisationGroup";
import { UserListInfo } from "src/app/models/user";
import { OperationEnum } from "src/app/constants/enum";
import { Title } from "@angular/platform-browser";
import { DataLayerService } from "src/app/shared/data-layer.service";

@Component({
    selector: 'app-manage-group-edit-users-confirm',
    templateUrl: './manage-group-edit-users-confirm-component.html',
    styleUrls: ['./manage-group-edit-users-confirm-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageGroupEditUsersConfirmComponent extends BaseComponent implements OnInit {
    organisationId: string;
    isEdit: boolean = false;
    editingGroupId: number = 0;
    userNames: string[] = [];
    addingUsers: UserListInfo[] = [];
    removingUsers: UserListInfo[] = [];
    routeData: any = {};
    usersTableHeaders = ['NAME', 'EMAIL'];
    usersColumnsToDisplay = ['name', 'userName'];
    groupName:string=''
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private orgGroupService: WrapperOrganisationGroupService, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            this.routeData = JSON.parse(queryParams.data);
            this.isEdit = this.routeData['isEdit'];
            this.editingGroupId = this.routeData['groupId'];
            this.groupName=this.routeData['groupName'];
        }
        var existingUsersString = sessionStorage.getItem("group_existing_users")
        var addingUsersString = sessionStorage.getItem("group_added_users");
        var removingUsersString = sessionStorage.getItem("group_removed_users");
        this.userNames = existingUsersString ? JSON.parse(existingUsersString) : [];
        this.addingUsers = addingUsersString ? JSON.parse(addingUsersString) : [];
        this.removingUsers = removingUsersString ? JSON.parse(removingUsersString) : [];
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    }

    ngOnInit() {
        this.titleService.setTitle(`Confirm - ${this.isEdit ? "Add/Remove Users" : "Add Users"} - Manage Groups - CCS`);
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: localStorage.getItem("user_name"),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
    }

    onConfirmClick() {
        let groupPatchRequestInfo: OrganisationGroupRequestInfo = {
            userInfo: {
                addedUserIds: this.addingUsers.map(au => au.userName),
                removedUserIds: this.removingUsers.map(au => au.userName)
            }
        };
        this.orgGroupService.patchUpdateOrganisationGroup(this.organisationId, this.editingGroupId, groupPatchRequestInfo)
            .subscribe(
                (result) => {
                    if (this.isEdit) {
                        let data = {
                            'isEdit': this.isEdit,
                            'groupId': this.editingGroupId
                        };
                        this.clearSessionStorageGroupUserData();
                        this.router.navigateByUrl(`manage-groups/operation-success/${this.isEdit ? OperationEnum.GroupUserUpdate : OperationEnum.GroupUserAdd}?data=` + JSON.stringify(data));
                    }
                    else {
                        let data = {
                            'isEdit': this.isEdit,
                            'groupId': this.editingGroupId,
                            'roleIds': [],
                            'userCount': this.addingUsers.length,
                            'groupName':this.groupName
                        };
                        this.clearSessionStorageGroupUserData();
                        this.router.navigateByUrl('manage-groups/edit-roles?data=' + JSON.stringify(data));
                    }
                },
                (error) => {
                    if (error.error == 'MFA_DISABLED_USERS_INCLUDED') {
                        let data = {
                            'isEdit': this.isEdit,
                            'groupId': this.editingGroupId
                        };
                        this.clearSessionStorageGroupUserData();
                        this.router.navigateByUrl(`manage-groups/error?data=` + JSON.stringify(data));
                    }
                });
        this.pushDataLayerEvent();
    }

    onGoToEditGroupClick() {
        this.routeData.isEdit = true;
        this.clearSessionStorageGroupUserData();
        this.router.navigateByUrl("manage-groups/view?data=" + JSON.stringify(this.routeData));
    }

    onCancelClick() {
        this.router.navigateByUrl("manage-groups/edit-users?data=" + JSON.stringify(this.routeData));
        this.pushDataLayerEvent();
    }

    clearSessionStorageGroupUserData() {
        sessionStorage.removeItem("group_existing_users");
        sessionStorage.removeItem("group_added_users");
        sessionStorage.removeItem("group_removed_users");
    }

    pushDataLayerEvent() {
		this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "Confirm - Add/Edit Users - Manage Groups"
		});
	  }
  
}