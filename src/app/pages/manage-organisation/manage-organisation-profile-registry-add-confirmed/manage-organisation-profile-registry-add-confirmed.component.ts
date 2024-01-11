import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { timeout } from 'rxjs/operators';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { Data } from 'src/app/models/data';
import { dataService } from 'src/app/services/data/data.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { UIState } from 'src/app/store/ui.states';

@Component({
  selector: 'app-manage-organisation-profile-registry-add-confirmed',
  templateUrl: './manage-organisation-profile-registry-add-confirmed.component.html',
  styleUrls: ['./manage-organisation-profile-registry-add-confirmed.component.scss'],
  animations: [
      slideAnimation({
          close: { 'transform': 'translateX(12.5rem)' },
          open: { left: '-12.5rem' }
      })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrganisationRegistryAddConfirmationComponent extends BaseComponent implements OnInit {

  public organisationId!: number;
  public orgId!: string;
  public routeParams!: any;

  constructor(private dataService: dataService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore,viewportScroller,scrollHelper);
    this.organisationId = parseInt(this.route.snapshot.paramMap.get('organisationId') || '0');
    this.orgId = JSON.parse(localStorage.getItem('organisation_id') + '');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params;
    });
    this.dataLayerService.pushPageViewEvent({
      scheme: this.routeParams.scheme,
      id: this.routeParams.id,
      organisationId: this.routeParams.this.organisationId
    });
   }
}
