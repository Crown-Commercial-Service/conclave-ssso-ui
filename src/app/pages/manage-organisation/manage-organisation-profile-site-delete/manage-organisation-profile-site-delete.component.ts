import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-manage-organisation-profile-site-delete',
    templateUrl: './manage-organisation-profile-site-delete.component.html',
    styleUrls: ['./manage-organisation-profile-site-delete.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ManageOrganisationSiteDeleteComponent extends BaseComponent implements OnInit {

  organisationId: string;
  siteId: number = 0;
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,private sessionService:SessionService,
        private contactService: WrapperOrganisationSiteService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.organisationId = localStorage.getItem('cii_organisation_id') || '';
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            
            this.siteId = routeData['siteId'];
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
        this.contactService.deleteOrganisationSite(this.organisationId, this.siteId).subscribe({
            next: () => { 
                this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.DeleteSite}`);           
            },
            error: (error : any) => {
                
            }
        });
        this.pushDataLayerEvent(buttonText);
    }

    getEditQueryData(): string {
        let data = {
          isEdit: true,
          siteId: this.siteId,
        };
        return JSON.stringify(data);
      }

    onCancelClick(buttonText:string){
        if(buttonText==='Edit site')
        {
        let data = {
            'isEdit': true,
            'siteId': this.siteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
        }
        else{
        this.pushDataLayerEvent(buttonText);}
    }

    pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText)
	  }
}
