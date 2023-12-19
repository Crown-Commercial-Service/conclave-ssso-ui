import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { WrapperUserContactService } from "src/app/services/wrapper/wrapper-user-contact.service";
import { ContactGridInfo, SiteContactInfoList, UserContactInfoList } from "src/app/models/contactInfo";
import { ContactHelper } from "src/app/services/helper/contact-helper.service";
import { WrapperSiteContactService } from "src/app/services/wrapper/wrapper-site-contact-service";
import { ContactAssignedStatus } from "src/app/constants/enum";
import { SessionStorageKey } from "src/app/constants/constant";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-contact-assign-component',
    templateUrl: './contact-assign-component.html',
    styleUrls: ['./contact-assign-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ContactAssignComponent extends BaseComponent implements OnInit {
    organisationId: string;
    contactTableHeaders = ['CONTACT_REASON', 'NAME', 'EMAIL', 'TELEPHONE_NUMBER','MOBILE_NUMBER', 'FAX', 'WEB_URL'];
    contactColumnsToDisplay = ['contactReason', 'name', 'email', 'phoneNumber','mobileNumber','fax', 'webUrl'];
    assigningSiteId: number = 0;
    assigningOrgId: string = "";
    contactUserName: string = "";
    contactSiteId: number = 0;
    contacts: ContactGridInfo[] = [];
    selectedContacts: ContactGridInfo[] = [];
    siteCreate: any;

    constructor(public userContactService: WrapperUserContactService,private sessionService:SessionService, public siteContactService: WrapperSiteContactService,
        private contactHelper: ContactHelper,
        protected uiStore: Store<UIState>, public router: Router, private activatedRoute: ActivatedRoute,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.assigningSiteId = routeData['assigningSiteId'] || 0;
            this.assigningOrgId = routeData['assigningOrgId'] || "";
            this.contactUserName = sessionStorage.getItem(SessionStorageKey.ContactAssignUsername) ?? "";
            this.contactSiteId = routeData['contactSiteId'] || 0;
            this.siteCreate=routeData['siteCreate'] || false;
        }
        let selectedContactString = sessionStorage.getItem("assigning-contact-list");
        if (selectedContactString) {
            this.selectedContacts = JSON.parse(selectedContactString);
        }
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
        if (this.contactSiteId && this.contactSiteId != 0) {
            this.getSiteContacts();
        }
        else {
            this.getUserContacts();
        }
    }

    getUserContacts() {
        this.userContactService.getUserContacts(this.contactUserName).subscribe({
            next: (userContactsInfo: UserContactInfoList) => {
                if (userContactsInfo != null) {
                    this.contacts = this.contactHelper.getContactGridInfoList(userContactsInfo.contactPoints);
                    this.fillCheckedStatusOnNavigatingFromConfirmPage();
                }
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    getSiteContacts() {
        this.siteContactService.getSiteContacts(this.organisationId, this.contactSiteId, ContactAssignedStatus.original).subscribe({
            next: (siteContactListInfo: SiteContactInfoList) => {
                if (siteContactListInfo != null) {
                    this.contacts = this.contactHelper.getContactGridInfoList(siteContactListInfo.contactPoints);
                    this.fillCheckedStatusOnNavigatingFromConfirmPage();
                }
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    fillCheckedStatusOnNavigatingFromConfirmPage() {
        if (this.selectedContacts) {
            this.selectedContacts.forEach((selectedContact) => {
                let contact = this.contacts.find(c => c.contactId == selectedContact.contactId);
                if (contact) {
                    contact.isChecked = true;
                }
            });
        }
    }

    onCheckBoxClickRow(dataRow: ContactGridInfo) {
        if (dataRow.isChecked) {
            this.selectedContacts.push(dataRow);
        }
        else {
            let addedListIndex = this.selectedContacts.findIndex(sc => sc.contactId == dataRow.contactId);
            this.selectedContacts.splice(addedListIndex, 1);
        }
    }

    onContinueClick(buttonText:string) {
        let contactString = JSON.stringify(this.selectedContacts);
        sessionStorage.setItem("assigning-contact-list", contactString);
        let data = {
            'assigningSiteId': this.assigningSiteId,
            'assigningOrgId': this.assigningOrgId,
            'contactSiteId': this.contactSiteId,
            'siteCreate':this.siteCreate
        };
        this.router.navigateByUrl('contact-assign/confirm?data=' + JSON.stringify(data));
        this.pushDataLayerEvent(buttonText);
    }

    onNavigateToHomeClick() {
        sessionStorage.removeItem("assigning-contact-list");
        sessionStorage.removeItem(SessionStorageKey.ContactAssignUsername);
        this.router.navigateByUrl('/home');
    }

    onNavigateToOrgClick() {
        sessionStorage.removeItem("assigning-contact-list");
        sessionStorage.removeItem(SessionStorageKey.ContactAssignUsername);
        this.router.navigateByUrl('manage-org/profile');
    }

    onNavigateToSiteClick() {
        sessionStorage.removeItem("assigning-contact-list");
        sessionStorage.removeItem(SessionStorageKey.ContactAssignUsername);
        let data = {
            'isEdit': true,
            'siteId': this.assigningSiteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }

    onCancelClick(buttonText:string) {
        sessionStorage.removeItem("assigning-contact-list");
        window.history.back();
        this.pushDataLayerEvent(buttonText);
        // let data = {
        //     'assigningSiteId': this.assigningSiteId,
        //     'assigningOrgId': this.assigningOrgId,
        //     'contactSiteId': this.contactSiteId,
        // };
        // if (this.contactSiteId != 0) {
        //     this.router.navigateByUrl('contact-assign/site-search?data=' + JSON.stringify(data));
        // }
        // else {
        //     this.router.navigateByUrl('contact-assign/user- ?data=' + JSON.stringify(data));
        // }
    }

    pushDataLayerEvent(buttonText:string) {
       this.dataLayerService.pushClickEvent(buttonText)
      }
}