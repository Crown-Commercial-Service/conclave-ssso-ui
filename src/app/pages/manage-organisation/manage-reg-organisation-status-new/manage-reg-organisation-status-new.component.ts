import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DataLayerService } from "src/app/shared/data-layer.service";

@Component({
    selector: 'app-manage-reg-organisation-status-new',
    templateUrl: './manage-reg-organisation-status-new.component.html',
    styleUrls: ['./manage-reg-organisation-status-new.component.scss']
})

export class ManageOrgRegSearchStatusNewComponent {

    constructor(private router: Router, private dataLayerService: DataLayerService) {
    }

    public onContinueNotRegistered() {
        this.router.navigateByUrl(`manage-org/register/newreg`);
    }

    goBack() {
        window.history.back();
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
    }
}