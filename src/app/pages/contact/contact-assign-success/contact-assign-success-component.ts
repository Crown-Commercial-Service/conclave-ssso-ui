import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { WrapperOrganisationSiteService } from "src/app/services/wrapper/wrapper-org-site-service";
import { OrganisationSiteResponse } from "src/app/models/site";

@Component({
    selector: 'app-contact-assign-success-component',
    templateUrl: './contact-assign-success-component.html',
    styleUrls: ['./contact-assign-success-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ContactAssignSuccessComponent extends BaseComponent implements OnInit {
    assigningSiteId: number = 0;
    assigningOrgId: string = "";
    siteId: number = 0;
    public siteInfo:any={}
    private organisationId: string;
    
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
        protected viewportScroller: ViewportScroller,private orgSiteService: WrapperOrganisationSiteService, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.assigningSiteId = routeData['assigningSiteId'] || 0;
            this.assigningOrgId = routeData['assigningOrgId'] || "";
        }
     this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    }

    ngOnInit(){
        this.getSiteDetails()
    }

    private getSiteDetails():void{
        this.orgSiteService.getOrganisationSite(this.organisationId, this.siteId).subscribe(
          {
            next: (siteInfo: OrganisationSiteResponse) => {
            this.siteInfo=siteInfo
            },
            error: (error: any) => {
              console.log(error);
            }
          });
       }

    onNavigateToProfileClick(){
        this.router.navigateByUrl(`manage-org/profile`);
    }

    onNavigateToSiteClick(){
        let data = {
            'isEdit': true,
            'siteId': this.assigningSiteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }
}