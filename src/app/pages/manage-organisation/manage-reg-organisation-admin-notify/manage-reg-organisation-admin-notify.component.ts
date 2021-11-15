import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { UIState } from "src/app/store/ui.states";

@Component({
    selector: 'app-manage-org-notify-admin',
    templateUrl: './manage-reg-organisation-admin-notify.component.html',
    styleUrls: ['./manage-reg-organisation-admin-notify.component.scss']
})

export class ManageOrgRegNotifyAdminComponent implements OnInit {

    orgName: string = '';

    constructor(protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    }

    async ngOnInit() {
        let orgInfo = this.GetOrgDetails();
        this.orgName = orgInfo.orgName;
    }

    GetOrgDetails() {
        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgReginfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
        return orgReginfo;
    }

}