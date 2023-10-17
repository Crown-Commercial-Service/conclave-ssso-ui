import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { OrganisationService } from "src/app/services/postgres/organisation.service";
import { UIState } from "src/app/store/ui.states";

@Component({
    selector: 'app-manage-reg-organisation-cii-display',
    templateUrl: './manage-reg-organisation-cii-display.component.html',
    styleUrls: ['./manage-reg-organisation-cii-display.component.scss']
  })
  
export class ManageOrgRegCIIOrgDisplayComponent extends BaseComponent implements OnInit {

    singleOrgExists = false;
    multipleOrgExists = false;
    orgNotExists = false;

    constructor(private organisationService: OrganisationService,
        private router: Router, protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
    }
    async ngOnInit() {
        let orgreginfo = sessionStorage.getItem('orgreginfo') ? JSON.parse(sessionStorage.getItem('orgreginfo')!) : {};
        let data = await this.organisationService.getByName(orgreginfo.orgName).toPromise();
        if (data.length == 0) {
            //Org does not exists
            this.orgNotExists = true;
        }
        else if (data.length == 1) {
            //Single Org exists
            this.singleOrgExists = true;
        }
        else
        {
            //Multiple Orgs exists
            this.multipleOrgExists = true;
        }
    }

    public onContinueNotRegistered() {
            this.router.navigateByUrl(`manage-org/register/newreg`);
    }

    goBack() {
        this.router.navigateByUrl(`manage-org/register/initial-search`);
    }

}