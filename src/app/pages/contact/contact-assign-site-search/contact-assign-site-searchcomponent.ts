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
import { OrganisationSite, OrganisationSiteInfoList, SiteGridInfo } from "src/app/models/site";
import { SessionStorageKey } from "src/app/constants/constant";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-contact-assign-site-search-component',
    templateUrl: './contact-assign-site-search-component.html',
    styleUrls: ['./contact-assign-site-search-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    standalone: false
})
export class ContactAssignSiteSearchComponent extends BaseComponent implements OnInit {
    organisationId: string;
    selectedSiteId: number = 0;
    searchSiteName: string = "";
    siteTableHeaders = ['SITE_NAME', 'STREET_ADDRESS', 'POSTAL_CODE', 'COUNTRY_CODE'];
    siteColumnsToDisplay = ['siteName', 'streetAddress', 'postalCode', 'countryCode'];
    siteData: SiteGridInfo[] = [];
    public searchSumbited:boolean=false;
    constructor(private wrapperSiteService: WrapperOrganisationSiteService,
        protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,private sessionService:SessionService,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    }

    ngOnInit() {
        this.getOrganisationSites();
        sessionStorage.removeItem(SessionStorageKey.ContactAssignUsername);
        this.dataLayerService.pushPageViewEvent();
    }

    getOrganisationSites() {
        this.wrapperSiteService.getOrganisationSites(this.organisationId, this.searchSiteName).subscribe({
            next: (orgContactListInfo: OrganisationSiteInfoList) => {
                if (orgContactListInfo != null) {
                    this.siteData = orgContactListInfo.sites.map((site: OrganisationSite) => {
                        let siteGridInfo: SiteGridInfo = {
                            siteId: site.details.siteId,
                            siteName: site.siteName,
                            streetAddress: site.address.streetAddress,
                            postalCode: site.address.postalCode,
                            countryCode: site.address.countryCode,
                            locality: site.address.locality,
                            region: site.address.region,
                        };
                        return siteGridInfo;
                    });
                }
            },
            error: (error: any) => {
            }
        });
    }

    searchTextChanged(event: any) {
        this.searchSiteName = event.target.value;
    }

    onSearchClick() {
        this.searchSumbited=true
        this.getOrganisationSites();
    }

    onSelectRow(dataRow: SiteGridInfo) {
        this.selectedSiteId = dataRow?.siteId ?? '';
    }

    onContinue(buttonText:string) {
        if (this.selectedSiteId != 0) {
            sessionStorage.removeItem("assigning-contact-list");
            let data = {
                'assigningOrgId': this.organisationId,
                'contactSiteId': this.selectedSiteId,
            };
            this.router.navigateByUrl('contact-assign?data=' + JSON.stringify(data));
        }
        this.pushDataLayerEvent(buttonText);
    }

    onCancelClick() {
        let data = {
            'assigningOrgId': this.organisationId,
            'contactSiteId': this.selectedSiteId,
        };
        this.router.navigateByUrl('contact-assign/select?data=' + JSON.stringify(data));
    }

    public onBack(buttonText:string){
      window.history.back();
      this.pushDataLayerEvent(buttonText);
    }

    pushDataLayerEvent(buttonText:string) {
       this.dataLayerService.pushClickEvent(buttonText);
      }
}