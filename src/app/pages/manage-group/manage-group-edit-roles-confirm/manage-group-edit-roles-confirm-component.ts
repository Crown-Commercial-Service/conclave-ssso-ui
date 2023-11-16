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
import { environment } from "src/environments/environment";
import { SharedDataService } from "src/app/shared/shared-data.service";
import { DataLayerService } from "src/app/shared/data-layer.service";

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
    addingOrderRoles: Role[] = [];
    removingRoles: Role[] = [];
    removingOrderdRoles: Role[] = [];
    routeData: any = {};
    userCount: number = 0;
    rolesTableHeaders = ['NAME'];
    rolesColumnsToDisplay = ['roleName'];
    public showRoleView:boolean = environment.appSetting.hideSimplifyRole
    public serviceRoleGroup:any={}
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private orgGroupService: WrapperOrganisationGroupService,
        private wrapperOrganisationService: WrapperOrganisationService,private sharedDataService:SharedDataService, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            this.routeData = JSON.parse(queryParams.data);
            this.isEdit = this.routeData['isEdit'];
            this.sharedDataService.selectedRoleforGroup.subscribe((data)=>{
                this.routeData = data
                this.editingGroupId = data['groupId'];
                this.roleIds = data['roleIds'];
                this.addingRoles = data['addingRoles'];
                this.removingRoles = data['removingRoles'] || [];
                this.userCount = data['userCount'] || 0;
            })
        }
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.groupName = sessionStorage.getItem('Gname') || '';
    }

    ngOnInit() {
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: localStorage.getItem("user_name"),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
        if(this.showRoleView){
            this.titleService.setTitle(`Confirm - ${"Group - Roles"}`);
        } else {
            this.titleService.setTitle(`Confirm services – Manage Groups - CCS`);
        }
        this.getOrganisationRoles()
        this.initialteServiceRoleGroups()
    }

    getOrganisationRoles() {
        this.orgGroupService.getOrganisationRoles(this.organisationId).subscribe({
            next: (roleListResponse: Role[]) => {
                if (roleListResponse != null) {
                    roleListResponse.forEach((roles:Role,index:number)=>{
                        this.chanageIndexValue(roles,index)
                    })
                }
            },
            error: (error: any) => {
            }
        });
    }


    private chanageIndexValue(roles: Role, index: number): void {
        const removeRole = this.removingRoles.find((r) => r.roleKey === roles.roleKey);
        const addRole = this.addingRoles.find((r) => r.roleKey === roles.roleKey);
        if (removeRole) {
          this.removingOrderdRoles.push(removeRole);
        }
        if (addRole) {
          this.addingOrderRoles.push(addRole);
        }
      }


    onConfirmClick() {
        let groupPatchRequestInfo: OrganisationGroupRequestInfo = {
            roleInfo: {
                addedRoleIds: this.addingRoles.map(ar => ar.roleId),
                removedRoleIds: this.removingRoles.map(rr => rr.roleId)
            }
        };
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
        this.pushDataLayerEvent();
    }

    onGoToEditGroupClick() {
        this.routeData.isEdit = true;
        this.router.navigateByUrl("manage-groups/view?data=" + JSON.stringify(this.routeData));
    }

    onCancelClick() {
        this.router.navigateByUrl("manage-groups/edit-roles?data=" + JSON.stringify(this.routeData));
        this.pushDataLayerEvent();
    }

    private initialteServiceRoleGroups(){
        if(this.showRoleView){
            this.serviceRoleGroup = {
                CONFIRM_ROLE:'Confirm roles for group',
                CONFIRM_FOLL_ROLE: "Confirm you want to add the following roles to group ",
                ROLES_ADDED_TO_GROUP: "Roles added to group",
                ROLES_REMOVED_FROM_GROUP:"Roles removed from group",
                CREATE_GROUP_WITHOUT_ROLE:"Create group without roles",
                SELECT_SERVICE:"Select different roles"
                }
           } else {
            this.serviceRoleGroup = {
                CONFIRM_ROLE:'Confirm services for group',
                CONFIRM_FOLL_ROLE: "Confirm you want to add the following services to group",
                ROLES_ADDED_TO_GROUP: "Services added to group",
                ROLES_REMOVED_FROM_GROUP:"Services removed from group",
                CREATE_GROUP_WITHOUT_ROLE:"Create group without Services",
                SELECT_SERVICE:"Select different Services"
                }
           }
        } 

        pushDataLayerEvent() {
            this.dataLayerService.pushEvent({ 
              event: "cta_button_click" ,
              page_location: "Confirm - Add/Edit Roles - Manage Groups"
            });
          }    
}
