import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { OperationEnum } from "src/app/constants/enum";
import { WrapperUserContactService } from "src/app/services/wrapper/wrapper-user-contact.service";
import { WrapperOrganisationContactService } from "src/app/services/wrapper/wrapper-org-contact-service";
import { WrapperSiteContactService } from "src/app/services/wrapper/wrapper-site-contact-service";
import { ViewportScroller } from "@angular/common";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-manage-organisation-contact-delete',
    templateUrl: './manage-organisation-contact-delete.component.html',
    styleUrls: ['./manage-organisation-contact-delete.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageOrganisationContactDeleteComponent extends BaseComponent implements OnInit {
    organisationId: string;
    contactId: number = 0;
    siteId: number = 0;
    constructor(protected uiStore: Store<UIState>,private sessionService:SessionService, private router: Router, private activatedRoute: ActivatedRoute,
        private contactService: WrapperOrganisationContactService, private siteContactService: WrapperSiteContactService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            console.log(routeData);
            this.contactId = routeData['contactId'];
            this.siteId = routeData['siteId'] || 0;
        }
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['isNewTab'] === 'true') {
              const urlTree = this.router.parseUrl(this.router.url);
              delete urlTree.queryParams['isNewTab'];
              this.router.navigateByUrl(urlTree.toString(), { replaceUrl: true });
            }
          });
        this.dataLayerService.pushPageViewEvent();
    }

    onDeleteConfirmClick(buttonText:string) {
        if (this.siteId == 0){
            this.contactService.deleteOrganisationContact(this.organisationId, this.contactId).subscribe({
                next: () => { 
                    this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.DeleteOrgContact}`);           
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
        else{
            this.siteContactService.deleteSiteContact(this.organisationId, this.siteId, this.contactId).subscribe({
                next: () => { 
                    let data = {
                        'siteId': this.siteId
                    };
                    this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.DeleteSiteContact}?data=` + JSON.stringify(data));           
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
        this.pushDataLayerEvent(buttonText);
    }

    onCancelClick(){
        let data = {
            'isEdit': true,
            'contactId': this.contactId,
            'siteId': this.siteId
        };
        this.router.navigateByUrl('manage-org/profile/contact-edit?data=' + JSON.stringify(data));
    }

    getEditQueryData(): string {
        let data = {
          isEdit: true,
          contactId : this.contactId,
          siteId: this.siteId,
        };
        return JSON.stringify(data);
      }
    
    public onBack(buttonText:string):void{
        window.history.back()
        this.pushDataLayerEvent(buttonText);
    }

    pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText)
	  }
}