import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ciiService } from "src/app/services/cii/cii.service";

@Component({
    selector: 'app-manage-reg-organisation-status-duplicate',
    templateUrl: './manage-reg-organisation-status-duplicate.component.html',
    styleUrls: ['./manage-reg-organisation-status-duplicate.component.scss']
})

export class ManageOrgRegSearchStatusDuplicateComponent {

    singleOrgExists = false;
    multipleOrgExists = false;
    orgNotExists = false;
    ciiOrgId: string = '';
    schemeName: string = '';

    constructor(private ciiService: ciiService, private router: Router,) {
    }

    public onOrgSelected(event: string) {
        let identifier = event;
        let scheme = localStorage.getItem('scheme') || "";
        // Get the CIIorgId from schemes/identifier
        this.ciiService.getIdentifierDetails(scheme, identifier).subscribe({
            next: () => { // No organisation registered
                this.router.navigateByUrl("manage-org/register/initial-search-status/new");
            },
            error: (error) => {
                if (error.status == "404") {
                    this.router.navigateByUrl("manage-org/register/error/notfound");
                }
                else if (error.status == "409") {
                    this.ciiOrgId = error.error.organisationId;
                    this.setOrgIdForOrgDetails(this.ciiOrgId);
                    this.router.navigateByUrl("manage-org/register/initial-search-status/exists");
                }
                else {
                    this.router.navigateByUrl("manage-org/register/error/generic");
                }
            }
        });
    }

    goBack() {
        window.history.back();
    }

    setOrgIdForOrgDetails(ciiOrgId: string) {
        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgReginfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
        orgReginfo.ciiOrgId = ciiOrgId;
        sessionStorage.setItem('orgreginfo', JSON.stringify(orgReginfo));
    }
}