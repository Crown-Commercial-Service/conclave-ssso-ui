import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OrganisationService } from "src/app/services/postgres/organisation.service";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-manage-reg-organisation-status-exists',
    templateUrl: './manage-reg-organisation-status-exists.component.html',
    styleUrls: ['./manage-reg-organisation-status-exists.component.scss']
})

export class ManageOrgRegSearchStatusExistsComponent implements OnInit{

    orgreginfo: any;
    public pageAccessMode:any;
    public buyerFlow:any;
    public isCustomMfaEnabled=environment.appSetting.customMfaEnabled;

    
    constructor(private organisationService: OrganisationService,private sessionService:SessionService, public router: Router,private ActivatedRoute: ActivatedRoute, private dataLayerService: DataLayerService) {
        this.ActivatedRoute.queryParams.subscribe((para: any) => {
            if(para.data != undefined){
                this.pageAccessMode = JSON.parse(atob(para.data));
              } else {
                this.pageAccessMode = null
              }
          });
    this.buyerFlow = localStorage.getItem('organisation_type') ?? '';

    }

    ngOnInit(){
        this.orgreginfo = this.getOrgDetails();
        this.dataLayerService.pushPageViewEvent();
    }

    public onContinueSingleOrgRegistered() {
        this.organisationService.requestOrgAdminToJoinOrg(this.orgreginfo.ciiOrgId, this.orgreginfo.adminUserFirstName, this.orgreginfo.adminUserLastName, this.orgreginfo.adminEmail).toPromise().then(() => {
          this.router.navigateByUrl(`/manage-org/register/notify-join-org?data=` + btoa(JSON.stringify(this.pageAccessMode)));
        });
        this.pushDataLayerEvent();
    }

    goBack() {
        window.history.back();
        this.pushDataLayerEvent();
    }

    getOrgDetails() {
        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgReginfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
        return orgReginfo;
    }

    pushDataLayerEvent() {
		this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "Search Organisation - Registration"
		});
	  }
}