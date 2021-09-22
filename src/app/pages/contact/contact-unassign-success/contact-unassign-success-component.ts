import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";

@Component({
    selector: 'app-contact-unassign-success-component',
    templateUrl: './contact-unassign-success-component.html',
    styleUrls: ['./contact-unassign-success-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ContactUnassignSuccessComponent extends BaseComponent implements OnInit {
    unassignSiteId: number = 0;
    unassignOrgId: string = "";

    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.unassignSiteId = routeData['unassignSiteId'] || 0;
            this.unassignOrgId = routeData['unassignOrgId'] || "";
        }
    }

    ngOnInit(){
    }

    onNavigateToProfileClick(){
        this.router.navigateByUrl(`manage-org/profile`);
    }

    onNavigateToSiteClick(){
        let data = {
            'isEdit': true,
            'siteId': this.unassignSiteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }
}