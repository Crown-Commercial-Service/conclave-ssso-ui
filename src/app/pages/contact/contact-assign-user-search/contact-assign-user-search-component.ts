import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { WrapperOrganisationService } from "src/app/services/wrapper/wrapper-org-service";
import { UserListInfo, UserListResponse } from "src/app/models/user";
import { environment } from "src/environments/environment";
import { SessionStorageKey } from "src/app/constants/constant";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-contact-assign-user-search-component',
    templateUrl: './contact-assign-user-search-component.html',
    styleUrls: ['./contact-assign-user-search-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ContactAssignUserSearchComponent extends BaseComponent implements OnInit {
    userList: UserListResponse;
    organisationId: string;
    selectedUserName: string = "";
    searchingUserName: string = "";
    currentPage: number = 1;
    pageCount: number = 0;
    pageSize: number = environment.listPageSize;
    usersTableHeaders = ['NAME', 'EMAIL'];
    usersColumnsToDisplay = ['name', 'userName'];
    assigningSiteId: number = 0;
    assigningOrgId: string = "";
    searchSumbited:boolean=false;
    siteCreate: any;
    constructor(private wrapperOrganisationService: WrapperOrganisationService,
        protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,private sessionService:SessionService,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.userList = {
            currentPage: this.currentPage,
            pageCount: 0,
            rowCount: 0,
            organisationId: this.organisationId,
            userList: []
        }
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.assigningSiteId = routeData['assigningSiteId'] || 0;
            this.assigningOrgId = routeData['assigningOrgId'] || "";
            this.siteCreate=routeData['siteCreate'] || false;

        }
    }

    ngOnInit() {
        this.getOrganisationUsers();
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: this.sessionService.decrypt('user_name'),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
    }

    getOrganisationUsers() {
        this.wrapperOrganisationService.getUsers(this.organisationId, this.searchingUserName, this.currentPage, this.pageSize, true).subscribe({
            next: (userListResponse: UserListResponse) => {
                if (userListResponse != null) {
                    this.userList = userListResponse;
                    this.pageCount = this.userList.pageCount;
                }
            },
            error: (error: any) => {
            }
        });
    }

    searchTextChanged(event: any) {
        this.searchingUserName = event.target.value;
    }

    onSearchClick() {
        this.searchSumbited=true
        this.currentPage = 1;
        this.getOrganisationUsers();
    }

    setPage(pageNumber: any) {
        this.currentPage = pageNumber;
        this.getOrganisationUsers();
    }

    onSelectRow(dataRow: UserListInfo) {
        this.selectedUserName = dataRow?.userName ?? '';
    }

    onContinue() {
        if (this.selectedUserName != "") {
            sessionStorage.removeItem("assigning-contact-list");
            sessionStorage.setItem(SessionStorageKey.ContactAssignUsername, this.selectedUserName);
            let data = {
                'assigningSiteId': this.assigningSiteId,
                'assigningOrgId': this.assigningOrgId,
                'siteCreate':this.siteCreate
            };
            this.router.navigateByUrl('contact-assign?data=' + JSON.stringify(data));
        }
        this.pushDataLayerEvent();
    }

    onNavigateToSiteClick(){
        let data = {
            'isEdit': true,
            'siteId': this.assigningSiteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }

    onCancelClick(){
        window.history.back();
        this.pushDataLayerEvent();
        // let data = {
        //     'assigningSiteId': this.assigningSiteId,
        //     'assigningOrgId': this.assigningOrgId,
        //     'contactUserName': encodeURIComponent(this.selectedUserName)
        // };
        // this.router.navigateByUrl('contact-assign/select?data=' + JSON.stringify(data));
    }

    pushDataLayerEvent() {
        this.dataLayerService.pushEvent({ 
          event: "cta_button_click" ,
          page_location: "Assign a user's contacts to your organisation account"
        });
      }

      isRadioDisabled(dataRow: any): boolean {
        return dataRow['isDormant'] === true;
      }
}