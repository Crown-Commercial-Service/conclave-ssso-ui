import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { WrapperOrganisationContactService } from "src/app/services/wrapper/wrapper-org-contact-service";
import { WrapperSiteContactService } from "src/app/services/wrapper/wrapper-site-contact-service";
import { ViewportScroller } from "@angular/common";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-contact-unassign-confirm-component',
    templateUrl: './contact-unassign-confirm-component.html',
    styleUrls: ['./contact-unassign-confirm-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ContactUnassignConfirmComponent extends BaseComponent implements OnInit {
    organisationId: string;
    unassignOrgId: string = "";
    unassignSiteId: number = 0;
    contactId: number = 0;
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,private sessionService:SessionService,
        public contactService: WrapperOrganisationContactService, public siteContactService: WrapperSiteContactService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.contactId = routeData['contactId'];
            this.unassignOrgId = routeData['unassignOrgId'] || 0;
            this.unassignSiteId = routeData['unassignSiteId'] || 0;
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
        if (this.unassignSiteId == 0){
            this.contactService.unassignOrgContact(this.unassignOrgId, [this.contactId]).subscribe({
                next: () => { 
                    let data = {
                        'unassignOrgId': this.unassignOrgId
                    };
                    this.router.navigateByUrl(`contact-unassign/success?data=` + JSON.stringify(data));            
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
        else{
            this.siteContactService.unassignSiteContact(this.organisationId, this.unassignSiteId, [this.contactId]).subscribe({
                next: () => { 
                    let data = {
                        'unassignSiteId': this.unassignSiteId
                    };
                    this.router.navigateByUrl(`contact-unassign/success?data=` + JSON.stringify(data));           
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
        this.pushDataLayerEvent(buttonText); 
    }

    onCancelClick(buttonText:string){
        let data = {
            'isEdit': true,
            'contactId': this.contactId,
            'siteId': this.unassignSiteId
        };
        this.router.navigateByUrl('manage-org/profile/contact-edit?data=' + JSON.stringify(data));
        if(buttonText==='Cancel')
        {
        this.pushDataLayerEvent(buttonText);
        }
    }

    pushDataLayerEvent(buttonText:string) {
       this.dataLayerService.pushClickEvent(buttonText);
      }
}