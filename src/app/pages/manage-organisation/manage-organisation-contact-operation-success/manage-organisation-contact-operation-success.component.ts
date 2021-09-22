import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-manage-organisation-contact-operation-success',
    templateUrl: './manage-organisation-contact-operation-success.component.html',
    styleUrls: ['./manage-organisation-contact-operation-success.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageOrganisationContactOperationSuccessComponent extends BaseComponent implements OnInit {

    operation: OperationEnum;
    operationEnum = OperationEnum;
    siteId: number = 0;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        this.operation = parseInt(this.activatedRoute.snapshot.paramMap.get('operation') || '0');
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.siteId = routeData['siteId'] || 0;
        }
    }

    ngOnInit() {
        let area: string = "";
        switch (this.operation) {
            case this.operationEnum.CreateOrgContact:
                area = 'Add - Organisation Contact'
                break;
            case this.operationEnum.UpdateOrgContact:
                area = 'Edit - Organisation Contact'
                break;
            case this.operationEnum.DeleteOrgContact:
                area = 'Delete - Organisation Contact'
                break;
            case this.operationEnum.CreateSiteContact:
                area = 'Add - Site Contact'
                break;
            case this.operationEnum.UpdateSiteContact:
                area = 'Edit - Site Contact'
                break;
            case this.operationEnum.DeleteSiteContact:
                area = 'Delete - Site Contact'
                break;
            case this.operationEnum.CreateSite:
                area = 'Add - Site'
                break;
            case this.operationEnum.UpdateSite:
                area = 'Edit - Site'
                break;
            case this.operationEnum.DeleteSite:
                area = 'Delete - Site'
                break;
            default:
                break
        }
        this.titleService.setTitle(`Success - ${area} - CCS`);
    }

    onNavigateToProfileClick() {
        this.router.navigateByUrl(`manage-org/profile`);
    }

    onNavigateToSiteClick() {
        let data = {
            'isEdit': true,
            'siteId': this.siteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }
}
