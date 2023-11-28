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
import { DataLayerService } from "src/app/shared/data-layer.service";

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
    siteCreate: any;
    
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
        protected viewportScroller: ViewportScroller,private orgSiteService: WrapperOrganisationSiteService, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.assigningSiteId = routeData['assigningSiteId'] || 0;
             this.assigningOrgId = routeData['assigningOrgId'] || "";
             this.siteCreate=routeData['siteCreate'] || false;
             console.log("routeData",routeData)
        }
     this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    }

    ngOnInit(){
        if(this.assigningSiteId!=0){
            this.getSiteDetails()
        }
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
                event: "page_view" ,
                page_location: this.router.url.toString(),
                user_name: localStorage.getItem("user_name"),
                cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
            });
        })
    }

    private getSiteDetails():void{
        this.orgSiteService.getOrganisationSite(this.organisationId, this.assigningSiteId ).subscribe(
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

    getQueryData(): string {
        let data = {
            'isEdit': true,
            'siteId': this.assigningSiteId
        };
        return JSON.stringify(data);
      }
}