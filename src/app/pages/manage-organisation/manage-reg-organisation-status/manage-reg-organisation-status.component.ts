import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { OrganisationRegBasicInfo } from "src/app/models/organisation";
import { ciiService } from "src/app/services/cii/cii.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { OrganisationService } from "src/app/services/postgres/organisation.service";
import { UIState } from "src/app/store/ui.states";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-manage-reg-organisation-status',
    templateUrl: './manage-reg-organisation-status.component.html',
    styleUrls: ['./manage-reg-organisation-status.component.scss']
})

export class ManageOrgRegSearchStatusComponent extends BaseComponent implements OnInit {

    singleOrgExists = false;
    multipleOrgExists = false;
    orgNotExists = false;
    ciiOrgId: string = '';
    schemeName: string = '';

    constructor(private organisationService: OrganisationService, private ciiService: ciiService,
        private route: ActivatedRoute, private router: Router, protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.route.snapshot.queryParams;
        this.ciiOrgId = queryParams?.id || '';
    }
    async ngOnInit() {
        if (this.ciiOrgId == '') {
            let orgreginfo = this.getOrgDetails();
            let data = await this.organisationService.getByName(orgreginfo.orgName).toPromise();
            localStorage.removeItem('scheme');
            localStorage.removeItem('scheme_name');
            if (data.length == 0) {
                //Org does not exist
                this.orgNotExists = true;
            }
            else if (data.length == 1) {
                //Single Org exists
                this.singleOrgExists = true;
                this.ciiOrgId = data[0].ciiOrganisationId;
            }
            else {
                //Multiple Orgs exists
                this.multipleOrgExists = true;
            }
        }
        else {
            this.schemeName = JSON.parse(localStorage.getItem('scheme_name') + '').replace('"', '').replace('"', '');
            this.singleOrgExists = true;
        }
    }

    public onOrgSelected(event: string) {
        let identifier = event;
        let scheme = localStorage.getItem('scheme') || "";
        // Get the CIIorgId from schemes/identifier
        this.ciiService.getIdentifierDetails(scheme, identifier).subscribe({
            next: () => { // No organisation registered
                this.multipleOrgExists = false;
                this.singleOrgExists = false;
                this.orgNotExists = true;
            },
            error: (error) => {
                if (error.status == "404") {
                    this.router.navigateByUrl("manage-org/register/error/notfound");
                }
                else if (error.status == "409") {
                    this.ciiOrgId = error.error.organisationId;
                    this.multipleOrgExists = false;
                    this.singleOrgExists = true;
                }
                else {
                    this.router.navigateByUrl("manage-org/register/error/generic");
                }
            }
        });
    }

    public onContinueSinglrOrgRegistered() {
        let orgreginfo = this.getOrgDetails();
        this.organisationService.requestOrgAdminToJoinOrg(this.ciiOrgId, orgreginfo.adminUserFirstName, orgreginfo.adminUserLastName, orgreginfo.adminEmail).toPromise().then(() => {
            this.router.navigateByUrl(`manage-org/register/notify-join-org`);
        });
    }

    public onContinueNotRegistered() {
        this.router.navigateByUrl(`manage-org/register/newreg`);
    }

    goBack() {
        this.router.navigateByUrl(`manage-org/register/initial-search`);
    }

    getOrgDetails() {
        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgReginfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
        return orgReginfo;
    }

}