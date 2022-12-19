import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OrganisationService } from "src/app/services/postgres/organisation.service";

@Component({
    selector: 'app-manage-reg-organisation-status-exists',
    templateUrl: './manage-reg-organisation-status-exists.component.html',
    styleUrls: ['./manage-reg-organisation-status-exists.component.scss']
})

export class ManageOrgRegSearchStatusExistsComponent implements OnInit{

    orgreginfo: any;
    public pageAccessMode:any;

    
    constructor(private organisationService: OrganisationService, private router: Router,private ActivatedRoute: ActivatedRoute) {
        this.ActivatedRoute.queryParams.subscribe((para: any) => {
            this.pageAccessMode = JSON.parse(atob(para.data));
          });
    }

    ngOnInit(){
        this.orgreginfo = this.getOrgDetails();
    }

    public onContinueSingleOrgRegistered() {
        
        this.organisationService.requestOrgAdminToJoinOrg(this.orgreginfo.ciiOrgId, this.orgreginfo.adminUserFirstName, this.orgreginfo.adminUserLastName, this.orgreginfo.adminEmail).toPromise().then(() => {
            this.router.navigateByUrl(`manage-org/register/notify-join-org`);
        });
    }

    goBack() {
        window.history.back();
    }

    getOrgDetails() {
        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgReginfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
        return orgReginfo;
    }

}