import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { Router } from "@angular/router";
import { Group, GroupList } from "src/app/models/organisationGroup";
import { WrapperOrganisationGroupService } from "src/app/services/wrapper/wrapper-org--group-service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { ViewportScroller } from "@angular/common";
import { environment } from "src/environments/environment";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-manage-group-list',
    templateUrl: './manage-group-list-component.html',
    styleUrls: ['./manage-group-list-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageGroupListComponent extends BaseComponent implements OnInit {
    public showRoleView:boolean = environment.appSetting.hideSimplifyRole
    groupList: GroupList;
    organisationId: string;
    searchText: string = "";
    groupsTableHeaders = ['GROUP', 'CREATED_DATE'];
    groupsColumnsToDisplay = ['groupName', 'createdDate'];
    searchSumbited:boolean=false;
    constructor(private groupService: WrapperOrganisationGroupService,
        protected uiStore: Store<UIState>, private router: Router,private sessionService:SessionService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.groupList = {
            organisationId: this.organisationId,
            groupList: []
        }
    }

    ngOnInit() {
        sessionStorage.removeItem('group_existing_users');
        sessionStorage.removeItem('group_added_users');
        sessionStorage.removeItem('group_removed_users');
        this.getOrganisationUsers();
        this.dataLayerService.pushPageViewEvent();
    }

    getOrganisationUsers() {
        this.groupService.getOrganisationGroups(this.organisationId, this.searchText).subscribe({
            next: (userListResponse: GroupList) => {
                if (userListResponse != null) {
                    this.groupList = userListResponse;
                    this.groupList.groupList.forEach((f)=>{
                        let data = {
                            'isEdit': true,
                            'groupId':f.groupId
                        };
                        let queryParams = {data: JSON.stringify(data)}
                         f.routeLink= `/manage-groups/view`,
                         f.routeData = queryParams
                    })
                }
            },
            error: (error: any) => {
            }
        });
    }

    onAddClick() {
        let data = {
            'isEdit': false,
            'groupId': 0
        };
        this.router.navigateByUrl('manage-groups/edit-name?data=' + JSON.stringify(data));
        this.dataLayerService.pushEvent({ 
            event: "cta_button_click" ,
            page_location: "Manage Groups"
          });
    }

    searchTextChanged(event: any) {
        this.searchText = event.target.value;
    }

    onSearchClick() {
        this.searchSumbited=true
        this.getOrganisationUsers();
    }
 
    onEditRow(dataRow: Group) {
        let data = {
            'isEdit': true,
            'groupId': dataRow.groupId
        };
        this.router.navigateByUrl('manage-groups/view?data=' + JSON.stringify(data));
    }
}