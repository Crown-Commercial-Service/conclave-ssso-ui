import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { ContactAssignmentInfo, ContactGridInfo } from "src/app/models/contactInfo";
import { WrapperSiteContactService } from "src/app/services/wrapper/wrapper-site-contact-service";
import { AssignedContactType } from "src/app/constants/enum";
import { WrapperOrganisationContactService } from "src/app/services/wrapper/wrapper-org-contact-service";

@Component({
    selector: 'app-contact-assign-confirm-component',
    templateUrl: './contact-assign-confirm-component.html',
    styleUrls: ['./contact-assign-confirm-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ContactAssignConfirmComponent extends BaseComponent implements OnInit {
    organisationId: string;
    
    contactTableHeaders = ['CONTACT_REASON', 'NAME', 'EMAIL', 'TELEPHONE_NUMBER', 'FAX', 'WEB_URL'];
    contactColumnsToDisplay = ['contactReason', 'name', 'email', 'phoneNumber', 'fax', 'webUrl'];
    assigningSiteId: number = 0;
    assigningOrgId: string = "";
    contactUserName: string = "";
    contactSiteId: number = 0;
    selectedContacts: ContactGridInfo[] = [];
    selectedContactIds: number[] = [];

    constructor(private siteContactService: WrapperSiteContactService, private orgContactService: WrapperOrganisationContactService,
        protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.assigningSiteId = routeData['assigningSiteId'] || 0;
            this.assigningOrgId = routeData['assigningOrgId'] || "";
            this.contactUserName = routeData['contactUserName'] || "";
            this.contactSiteId = routeData['contactSiteId'] || 0;
        }
        let selectedContactString = sessionStorage.getItem("assigning-contact-list");
        if (selectedContactString) {
            this.selectedContacts = JSON.parse(selectedContactString);
        }
        this.selectedContactIds = this.selectedContacts.map(sc => sc.contactId || 0);
    }

    ngOnInit() {
    }

    onConfirmClick() {
        if (this.assigningSiteId && this.assigningSiteId != 0) {
            this.assignToSiteContacts();
        }
        else {
            this.assignToOrgContacts()
        }
    }

    assignToSiteContacts() {
        let contactAssignmentInfo: ContactAssignmentInfo = {
            assigningContactType: AssignedContactType.User,
            assigningContactPointIds: this.selectedContactIds,
            assigningContactsUserId: this.contactUserName
        };

        this.siteContactService.assignSiteContact(this.organisationId, this.assigningSiteId, contactAssignmentInfo).subscribe({
            next: () => {
                this.onSuccess();
            },
            error: (error: any) => {
                this.onError(error.error);
            }
        });
    }

    assignToOrgContacts() {
        let contactAssignmentInfo: ContactAssignmentInfo = {
            assigningContactType: this.contactUserName && this.contactUserName != '' ? AssignedContactType.User : AssignedContactType.Site,
            assigningContactPointIds: this.selectedContactIds,
            assigningContactsUserId: this.contactUserName,
            assigningContactsSiteId: this.contactSiteId
        };

        this.orgContactService.assignOrgContact(this.organisationId, contactAssignmentInfo).subscribe({
            next: () => {
                this.onSuccess();
            },
            error: (error: any) => {
                this.onError(error.error);
            }
        });
    }

    onSuccess(){
        sessionStorage.removeItem("assigning-contact-list");
        let data = {
            'assigningSiteId': this.assigningSiteId,
            'assigningOrgId': this.assigningOrgId
        };
        this.router.navigateByUrl('contact-assign/success?data=' + JSON.stringify(data));
    }

    onError(errorCode: string){
        sessionStorage.removeItem("assigning-contact-list");
        let data = {
            'assigningSiteId': this.assigningSiteId,
            'assigningOrgId': this.assigningOrgId,
            'errorCode': errorCode
        };
        this.router.navigateByUrl('contact-assign/error?data=' + JSON.stringify(data));
    }

    onCancelClick() {
        window.history.back();
    }

    onNavigateToHomeClick() {
        sessionStorage.removeItem("assigning-contact-list");
        this.router.navigateByUrl('/home');
    }

    onNavigateToOrgClick() {
        sessionStorage.removeItem("assigning-contact-list");
        this.router.navigateByUrl('manage-org/profile');
    }

    onNavigateToSiteClick() {
        sessionStorage.removeItem("assigning-contact-list");
        let data = {
            'isEdit': true,
            'siteId': this.assigningSiteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }

}