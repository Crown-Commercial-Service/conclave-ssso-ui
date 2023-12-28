import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { slideAnimation } from "src/app/animations/slide.animation";
import { User, UserGroup, UserListInfo, UserListResponse, UserProfileRequestInfo,UserListResponseWithLink } from "src/app/models/user";
import { WrapperUserService } from "src/app/services/wrapper/wrapper-user.service";
import { WrapperUserContactService } from "src/app/services/wrapper/wrapper-user-contact.service";
import { ContactPoint, UserContactInfoList } from "src/app/models/contactInfo";
import { Router } from "@angular/router";
import { OperationEnum } from "src/app/constants/enum";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { WrapperOrganisationService } from "src/app/services/wrapper/wrapper-org-service";
import { environment } from "src/environments/environment";
import { AuditLoggerService } from "src/app/services/postgres/logger.service";
import { SessionStorageKey } from "src/app/constants/constant";
import { SharedDataService } from "src/app/shared/shared-data.service";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";
import { LoadingIndicatorService } from 'src/app/services/helper/loading-indicator.service';

@Component({
    selector: 'app-manage-user-profiles',
    templateUrl: './manage-user-profiles-component.html',
    styleUrls: ['./manage-user-profiles-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageUserProfilesComponent extends BaseComponent implements OnInit {
    userList: UserListResponse;
    organisationId: string;
    searchingUserName: string = "";
    currentPage: number = 1;
    pageCount: number = 0;
    pageSize: number = environment.listPageSize;
    usersTableHeaders = ['NAME', 'EMAIL'];
    usersColumnsToDisplay = ['name', 'userName'];
    searchSumbited:boolean=false;
    public isBulkUpload=environment.appSetting.hideBulkupload
    constructor(private wrapperOrganisationService: WrapperOrganisationService,
        protected uiStore: Store<UIState>,private sessionService:SessionService, private router: Router, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,
        private auditLogService: AuditLoggerService,private sharedDataService:SharedDataService, private dataLayerService: DataLayerService,
        private loadingIndicatorService: LoadingIndicatorService) {
        super(uiStore, viewportScroller, scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        this.userList = {
            currentPage: this.currentPage,
            pageCount: 0,
            rowCount: 0,
            organisationId: this.organisationId,
            userList: []
        }
        sessionStorage.removeItem(SessionStorageKey.ManageUserUserName);     
        localStorage.removeItem('ManageUserUserName');
        sessionStorage.removeItem(SessionStorageKey.OperationSuccessUserName);
        localStorage.removeItem('OperationSuccessUserName');
    }

    async ngOnInit() {
        this.loadingIndicatorService.isLoading.next(true);
        this.loadingIndicatorService.isCustomLoading.next(true);
        this.dataLayerService.pushPageViewEvent();
        
        await this.auditLogService.createLog({
            eventName: "Access", applicationName: "Manage-user-account",
            referenceData: `UI-Log`
        }).toPromise();
        this.getOrganisationUsers();
        this.loadingIndicatorService.isLoading.next(false);
        this.loadingIndicatorService.isCustomLoading.next(false);
    }

    getOrganisationUsers() {
        this.wrapperOrganisationService.getUsers(this.organisationId, this.searchingUserName, this.currentPage, this.pageSize).subscribe({
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

    onAddClick(buttonText:string) {
        this.router.navigateByUrl("manage-users/add-user-selection");
        if(!this.isBulkUpload){
            this.router.navigateByUrl("manage-users/add-user-selection");
        } else {
            this.router.navigateByUrl("manage-users/add-user/details");
        }
        this.dataLayerService.pushClickEvent(buttonText)
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

    onEditRow(dataRow: UserListInfo) {
        console.log(dataRow);
         let  data = {
                'rowData':dataRow.userName
        };
        this.sharedDataService.storeUserDetails(JSON.stringify(data));
        localStorage.setItem('ManageUserUserName',dataRow.userName);
        sessionStorage.setItem(SessionStorageKey.ManageUserUserName, dataRow.userName);
        localStorage.setItem('ManageUserUserName', dataRow.userName);
        this.router.navigateByUrl('manage-users/add-user/details?data=' + btoa(JSON.stringify({'isEdit': true})));
    }
}
