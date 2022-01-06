import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-manage-reg-organisation-status-new',
    templateUrl: './manage-reg-organisation-status-new.component.html',
    styleUrls: ['./manage-reg-organisation-status-new.component.scss']
})

export class ManageOrgRegSearchStatusNewComponent {

    constructor(private router: Router) {
    }

    public onContinueNotRegistered() {
        this.router.navigateByUrl(`manage-org/register/newreg`);
    }

    goBack() {
        window.history.back();
    }
}