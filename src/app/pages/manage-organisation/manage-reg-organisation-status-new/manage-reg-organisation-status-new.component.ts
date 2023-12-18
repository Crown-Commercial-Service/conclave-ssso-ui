import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-manage-reg-organisation-status-new',
    templateUrl: './manage-reg-organisation-status-new.component.html',
    styleUrls: ['./manage-reg-organisation-status-new.component.scss']
})

export class ManageOrgRegSearchStatusNewComponent {

    constructor(private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) {
    }

    public onContinueNotRegistered() {
        this.router.navigateByUrl(`manage-org/register/newreg`);
        this.dataLayerService.pushEvent({ 
            event: "cta_button_click" ,
            page_location: "Search Organisation - Registration"
          });
    }

    goBack() {
        window.history.back();
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }
}