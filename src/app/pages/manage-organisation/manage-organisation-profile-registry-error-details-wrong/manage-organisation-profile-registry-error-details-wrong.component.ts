import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { timeout } from 'rxjs/operators';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { Location, ViewportScroller } from '@angular/common';

import { BaseComponent } from 'src/app/components/base/base.component';
import { Data } from 'src/app/models/data';
import { dataService } from 'src/app/services/data/data.service';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-manage-organisation-profile-registry-error-details-wrong',
  templateUrl: './manage-organisation-profile-registry-error-details-wrong.component.html',
  styleUrls: ['./manage-organisation-profile-registry-error-details-wrong.component.scss'],
  animations: [
      slideAnimation({
          close: { 'transform': 'translateX(12.5rem)' },
          open: { left: '-12.5rem' }
      })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrganisationRegistryDetailsWrongComponent extends BaseComponent implements OnInit {

  public organisationId!: string;
  ccsContactUrl : string = environment.uri.ccsContactUrl;
  public routeParams!: any;
  
  constructor(private dataService: dataService,private sessionService:SessionService, private location: Location, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore,viewportScroller,scrollHelper);
    this.organisationId = this.route.snapshot.paramMap.get('organisationId') || "";
  }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.routeParams = params;
    });

    this.dataLayerService.pushPageViewEvent({organisationId: this.routeParams.this.organisationId});
  }

  public goToSearch() {
    this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search`);
  }

}
